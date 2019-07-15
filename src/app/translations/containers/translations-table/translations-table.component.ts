import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Translation } from 'src/app/upload-translation-file/models/translation';
import { convertFromSlate, TaalPart } from 'taal-editor';
import produce from 'immer';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-translations-table',
  templateUrl: './translations-table.component.html',
  styleUrls: ['./translations-table.component.less']
})
export class TranslationsTableComponent implements OnInit {

  @Input() translations: Translation[];
  @Input() sourceLanguage: string;
  @Input() targetLanguage: string;
  @Input() missingTranslationsMap: { [key: string]: boolean };
  @Input() invalidTranslationsMap: { [key: string]: any };

  @Output() saveTranslation: EventEmitter<{index: number, target: TaalPart[]}> = new EventEmitter();

  editCache: { [key: string]: any } = {};
  mapOfExpandData: { [key: string]: boolean } = {};
  taalEditorActionDispatcher: Subject<{ index: number, action: string, data: any }> = new Subject();

  startEdit(index: number): void {
    this.editCache[index].edit = true;
    this.mapOfExpandData[index] = true;
  }

  undoEdit(index: number): void {
    this.editCache[index] = {
      data: { ...this.translations[index] },
      edit: false,
      missingTranslations: []
    };
    this.mapOfExpandData[index] = false;
  }

  saveEdit(index: number): void {
    this.editCache[index].edit = false;
    let targetParts = convertFromSlate(this.editCache[index].data.draftTranslation)

    this.saveTranslation.emit({index, target: targetParts.parts})
    this.mapOfExpandData[index] = false;
  }

  updateEditCache(): void {

    this.translations.forEach((item, i) => {
      this.editCache[i] = {
        edit: false,
        data: { ...item },
        missingPlaceholders: []
      };
    });
  }

  taalEditorChange(event: any) {
    this.editCache[event.index].data.draftTranslation = event.value;

    this.updateMissingPlaceholders(event.index);
  }

  addPlaceholder(placeholder: any, index: number) {
    this.taalEditorActionDispatcher.next({index, action: 'ADD_PLACEHOLDER', data: placeholder.meta});
    this.updateMissingPlaceholders(index);
  }

  updateMissingPlaceholders(index: number) {
    let targetParts = convertFromSlate(this.editCache[index].data.draftTranslation);
    let sourcePlaceholders = this.editCache[index].data.parts.filter(_ => _.type === 'PLACEHOLDER');
    let targetPlaceholders = targetParts.parts.filter(_ => _.type === 'PLACEHOLDER');

    let missingPlaceholders = sourcePlaceholders.filter(src => !targetPlaceholders.find(trg => trg.meta === src.meta))

    this.editCache[index].missingPlaceholders = missingPlaceholders;
  }

  ngOnInit(): void {
    this.updateEditCache();
  }

  getSource(translation: Translation) {
    return translation.sourceParts.map(_ => _.value).join('');
  }

  getTarget(translation: Translation) {
    return translation.targetParts.map(_ => _.value).join('');
  }

}
