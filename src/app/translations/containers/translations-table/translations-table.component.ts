import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Translation } from 'src/app/upload-translation-file/models/translation';
import { convertFromSlate, TaalPart } from 'taal-editor';

@Component({
  selector: 'app-translations-table',
  templateUrl: './translations-table.component.html',
  styleUrls: ['./translations-table.component.less']
})
export class TranslationsTableComponent implements OnInit {

  @Input() translations: Translation[];
  @Output() saveTranslation: EventEmitter<{index: number, target: TaalPart[]}> = new EventEmitter();

  editCache: { [key: string]: any } = {};

  startEdit(index: number): void {
    this.editCache[index].edit = true;
  }

  cancelEdit(index: number): void {
    this.editCache[index] = {
      data: { ...this.translations[index] },
      edit: false
    };
  }

  saveEdit(index: number): void {
    this.editCache[index].edit = false;
    let translationParts = convertFromSlate(this.editCache[index].data.draftTranslation)

    this.saveTranslation.emit({index, target: translationParts.parts})
  }

  updateEditCache(): void {
    this.translations.forEach((item, i) => {
      this.editCache[i] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  taalEditorChange(event: any) {
    this.editCache[event.index].data.draftTranslation = event.value;
  }

  ngOnInit(): void {
    this.updateEditCache();
  }

  getSource(translations: Translation) {
    return translations.sourceParts.map(_ => _.value).join('');
  }

  getTarget(translations: Translation) {
    return translations.targetParts.map(_ => _.value).join('');
  }

}
