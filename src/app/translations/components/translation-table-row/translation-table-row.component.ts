import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { convertFromSlate } from 'taal-editor';
import { Subject } from 'rxjs';
import { Translation } from 'src/app/upload-translation-file/models/translation';
import { ITaalIcuMessage } from 'src/app/upload-translation-file/models/taal-icu-message';
import { ITaalMessagePart } from 'src/app/upload-translation-file/models/taal-message-part';

@Component({
  selector: '[translationTableRow]',
  templateUrl: './translation-table-row.component.html',
  styleUrls: ['./translation-table-row.component.less']
})
export class TranslationTableRowComponent implements OnInit {

  @Input() edit: boolean;

  @Input() translationId: string;
  @Input() parts: ITaalMessagePart[];
  @Input() targetParts: ITaalMessagePart[];
  @Input() icuExpressions: ITaalIcuMessage[];
  @Input() targetIcuExpressions: ITaalIcuMessage[];

  @Input() icuExpressionTree: any;

  @Input() editCache: LocalCache;

  @Input() missingTranslation: boolean;
  @Input() invalidTranslation: boolean;

  @Input() missingPlaceholders: any[];
  @Input() missingICUExpressions: ITaalIcuMessage[];


  @Output() updateMissingPlaceholders: EventEmitter<ITaalMessagePart[]> = new EventEmitter();
  @Output() updateMissingICUExpressions: EventEmitter<ITaalMessagePart[]> = new EventEmitter();

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

    this.updateMissingPlaceholdersFn();
    this.updateMissingICUExpressionsFn();
  }

  updateMissingICUExpressionsFn() {
    let translation = convertFromSlate(this.draft);
    this.updateMissingICUExpressions.emit(<ITaalMessagePart[]>translation.parts)
  }

  updateMissingPlaceholdersFn() {
    let translation = convertFromSlate(this.draft);
    this.updateMissingPlaceholders.emit(<ITaalMessagePart[]>translation.parts)
  }

  updateICUExpressions(event: any) {
    this.targetIcuExpressions = event;
    this.saveEditEmit();
  }

  saveEditFn() {
    if (this.icuExpressions.length) {
      this.save.next();
    } else {
      this.saveEditEmit(); 
    }
  }

  saveEditEmit() {
    let targetParts = convertFromSlate(this.draft)
    this.editCache.data.targetParts = <any>targetParts;
    this.saveEdit.emit({ translationId: this.translationId, editCache: this.editCache });
  }

  undoEditFn() {
    this.saveEdit.emit({ translationId: this.translationId, editCache: this.editCache });
  }

  startEditFn() {
    this.startEdit.emit(this.translationId);
  }
}


export interface LocalCache {
  data: Translation;
  edit: boolean;
  icuExpressionTree: { cases: any[] }[];
  missingICUExpressions: ITaalIcuMessage[];
  missingPlaceholders: any[];
}