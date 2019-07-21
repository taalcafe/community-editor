import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Translation } from 'src/app/upload-translation-file/models/translation';
import { convertFromSlate, TaalPart } from 'taal-editor';
import produce from 'immer';
import { Subject } from 'rxjs';
import * as messageformat from 'messageformat-parser';
import { ITaalIcuMessage } from 'src/app/upload-translation-file/models/taal-icu-message';
import { ITaalMessagePart } from 'src/app/upload-translation-file/models/taal-message-part';
import { ParsedMessagePartType } from 'src/app/ngx-lib/impl/parsed-message-part';

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

  @Output() saveTranslation: EventEmitter<{index: number, target: TaalPart[], icuExpressions: ITaalIcuMessage[]}> = new EventEmitter();

  editCache: { [key: string]: any } = {};
  mapOfExpandData: { [key: string]: boolean } = {};
  taalEditorActionDispatcher: Subject<{ index: number, action: string, data: any }> = new Subject();

  startEdit(index: number): void {
    if (this.translations[index].targetIcuExpressions && this.translations[index].targetIcuExpressions.length) {
      let result = messageformat.parse(this.translations[index].targetIcuExpressions[0].parts[0].value);
      messageformat
      this.editCache[index].icuExpressionTree = result;
      this.editCache[index].icuExpressionTree
        .forEach(_ => _.cases.forEach(__ => __.tokens = __.tokens.join(', ')))
    }

    this.editCache[index].edit = true;
    this.mapOfExpandData[index] = true;
  }

  undoEdit(index: number): void {
    this.editCache[index] = {
      data: { ...this.translations[index] },
      edit: false,
      missingTranslations: [],
      missingICUExpressions: []
    };
    this.mapOfExpandData[index] = false;
  }

  saveEdit(index: number): void {
    this.editCache[index].edit = false;
    let targetParts = convertFromSlate(this.editCache[index].data.draftTranslation)

    let icuExpression;
    if(this.editCache[index].icuExpressionTree) {
      icuExpression = this.unparseICU(this.editCache[index].icuExpressionTree);
    } 
    this.saveTranslation.emit({
      index,
      target: targetParts.parts,
      icuExpressions: [icuExpression]
    })
    this.mapOfExpandData[index] = false;
  }

  unparseICU(expressionTree: any): ITaalMessagePart {
    let expressionTreeRootNode = expressionTree[0];
    let reducedTokens = expressionTreeRootNode.cases.reduce((prev, curr, i) => {
      let prevValue = i > 1 ? prev : `${prev.key} {${prev.tokens}}`;
      return prevValue += ` ${curr.key} {${curr.tokens}}`;
    })
    let result = `{${expressionTreeRootNode.arg}, ${expressionTreeRootNode.type}, ${reducedTokens} }`;

    return { type: ParsedMessagePartType.TEXT, key: '1', value: result };
    // return {
    //   key: '',
    //   type: ParsedMessagePartType.TEXT,
    //   value: [result]
    // };
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
    this.updateMissingICUExpressions(event.index);
  }

  addICUExpression(icuExpression: any, index: number) {
    this.taalEditorActionDispatcher.next({
      index,
      action: 'ADD_ICU_MESSAGE_REF',
      data: { key: icuExpression.id, value: `<ICU-Message-Ref_${icuExpression.id}/>` }
    });
    this.updateMissingICUExpressions(index);
  }

  addPlaceholder(placeholder: any, index: number) {
    this.taalEditorActionDispatcher.next({
      index,
      action: 'ADD_PLACEHOLDER',
      data: { key: placeholder.key, value: placeholder.value }
    });
    this.updateMissingPlaceholders(index);
  }

  updateMissingICUExpressions(index: number) {
    let data = this.editCache[index].data;
    let targetParts = convertFromSlate(data.draftTranslation);
    let targetICUExpressions = targetParts.parts.filter(_ => _.type === 'ICU_MESSAGE_REF');

    let missingICUExpressions = data.targetIcuExpressions.filter(src => {
      return !targetICUExpressions.find(trg => {
        return trg.value === `<ICU-Message-Ref_${src.id}/>`
      })
    })

    this.editCache[index].missingICUExpressions = missingICUExpressions;
  }

  updateMissingPlaceholders(index: number) {
    let targetParts = convertFromSlate(this.editCache[index].data.draftTranslation);
    let sourcePlaceholders = this.editCache[index].data.parts.filter(_ => _.type === 'PLACEHOLDER');
    let targetPlaceholders = targetParts.parts.filter(_ => _.type === 'PLACEHOLDER');
    let missingPlaceholders = sourcePlaceholders.filter(src => !targetPlaceholders.find(trg => trg.value === src.value))

    this.editCache[index].missingPlaceholders = missingPlaceholders;
  }

  ngOnInit(): void {
    this.updateEditCache();
  }
}
