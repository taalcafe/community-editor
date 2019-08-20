import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { convertFromSlate } from 'taal-editor';
import { Subject } from 'rxjs';
import { Translation } from 'src/app/upload-translation-file/models/translation';
import { ITaalIcuMessage } from 'src/app/upload-translation-file/models/taal-icu-message';

@Component({
  selector: '[translationTableRow]',
  templateUrl: './translation-table-row.component.html',
  styleUrls: ['./translation-table-row.component.less']
})
export class TranslationTableRowComponent implements OnInit {

  @Input() data: any;
  @Input() editCache: LocalCache;

  @Input() missingTranslation: boolean;
  @Input() invalidTranslation: boolean;

  @Output() startEdit: EventEmitter<string> = new EventEmitter();
  @Output() saveEdit: EventEmitter<{ translationId: string, editCache: LocalCache }> = new EventEmitter();
  @Output() undoEdit: EventEmitter<string> = new EventEmitter();

  taalEditorActionDispatcher: Subject<{ id: string, action: string, data: any }> = new Subject();
  save: Subject<void> = new Subject();

  draft: any;

  localCache: any;

  constructor() { }

  ngOnInit() { 
  }

  taalEditorChange(event: any) {
    this.draft = event.value;

    this.updateMissingPlaceholders();
    this.updateMissingICUExpressions();
  }

  updateMissingICUExpressions() {
    let data = this.editCache.data;
    let targetParts = convertFromSlate(this.draft);
    let targetICUExpressions = targetParts.parts.filter(_ => _.type === 'ICU_MESSAGE_REF');

    let missingICUExpressions = data.targetIcuExpressions.filter(src => {
      return !targetICUExpressions.find(trg => {
        return trg.value === `<ICU-Message-Ref_${src.key}/>`
      })
    })

    this.editCache.missingICUExpressions = missingICUExpressions;
  }

  updateMissingPlaceholders() {
    let targetParts = convertFromSlate(this.draft);
    let sourcePlaceholders = this.editCache.data.parts.filter(_ => _.type === 'PLACEHOLDER');
    let targetPlaceholders = targetParts.parts.filter(_ => _.type === 'PLACEHOLDER');
    let index = 0;

    const missingPlaceholders = [];
    while (index < sourcePlaceholders.length) {
      const currentValue = sourcePlaceholders[index].value;
      const sourcePlaceholdersCount = sourcePlaceholders.filter(_ => _.value === currentValue).length;
      const targetPlaceholdersCount = targetPlaceholders.filter(_ => _.value === currentValue).length;
      const missingPlaceholdersCount = missingPlaceholders.filter(_ => _.value === currentValue).length
      const countDiff = sourcePlaceholdersCount - targetPlaceholdersCount;

      if (countDiff > missingPlaceholdersCount) missingPlaceholders.push(sourcePlaceholders[index]);
      index++;
    }

    this.editCache.missingPlaceholders = missingPlaceholders;
  }

  updateICUExpressions(event: any) {

    this.editCache.data.targetIcuExpressions = event;

    let targetParts = convertFromSlate(this.draft)
    this.editCache['targetParts'] = targetParts;
    this.saveEdit.emit({ translationId: this.editCache.data.translationId, editCache: this.editCache });
  }

  saveEditFn() {
    this.save.next();
  }

  undoEditFn() {
    this.saveEdit.emit({ translationId: this.editCache.data.translationId, editCache: this.editCache });
  }

  startEditFn() {
    this.startEdit.emit(this.data.translationId);
  }
}


export interface LocalCache {
  data: Translation;
  edit: boolean;
  icuExpressionTree: { cases: any[] }[];
  missingICUExpressions: ITaalIcuMessage[];
  missingPlaceholders: any[];
}