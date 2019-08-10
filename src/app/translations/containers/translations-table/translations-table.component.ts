import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Translation } from 'src/app/upload-translation-file/models/translation';
import { convertFromSlate, TaalPart } from 'taal-editor';
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

  @Output() saveTranslation: EventEmitter<{ translationId: string, target: TaalPart[], icuExpressions: ITaalIcuMessage[] }> = new EventEmitter();

  editCache: { [key: string]: any } = {};
  mapOfExpandData: { [key: string]: boolean } = {};
  taalEditorActionDispatcher: Subject<{ id: string, action: string, data: any }> = new Subject();

  startEdit(translationId: string): void {
    const translation = this.translations.find(_ => _.translationId === translationId);

    if (translation.icuExpressions && translation.icuExpressions.length) {
      let icuExpressionParts = translation.icuExpressions[0].parts.map(_ => {
        return _.type === 'PLACEHOLDER' ?  `__taal__${this.stripCurlyBraces(_.value)}__taal__` : _.value
      });

      let result = messageformat.parse(icuExpressionParts.join(''));
      
      this.editCache[translationId].icuExpressionTree = result;
      this.editCache[translationId].icuExpressionTree
        .forEach(treeNode => treeNode.cases.forEach(_ => {
          const parts = []
          
          _.tokens.forEach(token => {
            let placeholderRegex = /__taal__(\w+)__taal__/;
            let remainingToken = token;
            while(placeholderRegex.test(remainingToken)) {
              const match = placeholderRegex.exec(token);
              const placeholder = match[0];
              const placeholderValue = match[1];
              if(match.index !== 0) {
                const beginning = token.substr(0, match.index)
                parts.push({
                  type: ParsedMessagePartType.TEXT,
                  meta: beginning,
                  value: beginning,
                  key: beginning
                })
              }

              parts.push({
                type: ParsedMessagePartType.PLACEHOLDER,
                meta: `{{${placeholderValue}}}`,
                value: `{{${placeholderValue}}}`,
                key: `{{${placeholderValue}}}`
              })

              remainingToken = remainingToken.substring(match.index + placeholder.length, remainingToken.length)
            }

            if(remainingToken.length) {
              parts.push({
                type: ParsedMessagePartType.TEXT,
                meta: remainingToken,
                value: remainingToken,
                key: remainingToken
              })
            }
            
            return parts
          })

          _.validationParts = parts;
          _.parts = parts;
        }))
    }
    
    this.editCache[translationId].edit = true;
    this.mapOfExpandData[translationId] = true;
  }

  stripCurlyBraces(str: string) {
    return str.replace(/{|}/g, '')
  }

  undoEdit(translationId: string): void {
    const translation = this.translations.find(_ => _.translationId === translationId);

    this.editCache[translationId] = {
      data: { ...translation },
      edit: false,
      missingTranslations: [],
      missingICUExpressions: []
    };
    this.mapOfExpandData[translationId] = false;
  }

  saveEdit(translationId: string): void {
    this.editCache[translationId].edit = false;
    let targetParts = convertFromSlate(this.editCache[translationId].data.draftTranslation)

    let icuExpression;
    if (this.editCache[translationId].icuExpressionTree) {
      icuExpression = this.unparseICU(this.editCache[translationId].icuExpressionTree);
    } 

    this.saveTranslation.emit({
      translationId,
      target: targetParts.parts,
      icuExpressions: [icuExpression]
    })
    this.mapOfExpandData[translationId] = false;
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

    this.translations.forEach(item => {
      this.editCache[item.translationId] = {
        edit: false,
        data: { ...item },
        missingPlaceholders: [],
        missingICUExpressions: []
      };
    });
  }

  taalEditorChange(event: any) {
    this.editCache[event.id].data.draftTranslation = event.value;

    this.updateMissingPlaceholders(event.id);
    this.updateMissingICUExpressions(event.id);
  }

  addICUExpression(icuExpression: any, translationId: string) {
    this.taalEditorActionDispatcher.next({
      id: translationId,
      action: 'ADD_ICU_MESSAGE_REF',
      data: { key: icuExpression.id, value: `<ICU-Message-Ref_${icuExpression.key}/>` }
    });
    this.updateMissingICUExpressions(translationId);
  }

  addPlaceholder(placeholder: any, translationId: string) {
    this.taalEditorActionDispatcher.next({
      id: translationId,
      action: 'ADD_PLACEHOLDER',
      data: { key: placeholder.key, value: placeholder.value }
    });
    this.updateMissingPlaceholders(translationId);
  }

  updateMissingICUExpressions(translationId: string) {
    let data = this.editCache[translationId].data;
    let targetParts = convertFromSlate(data.draftTranslation);
    let targetICUExpressions = targetParts.parts.filter(_ => _.type === 'ICU_MESSAGE_REF');

    let missingICUExpressions = data.targetIcuExpressions.filter(src => {
      return !targetICUExpressions.find(trg => {
        return trg.value === `<ICU-Message-Ref_${src.key}/>`
      })
    })

    this.editCache[translationId].missingICUExpressions = missingICUExpressions;
  }

  updateMissingPlaceholders(translationId: string) {
    let targetParts = convertFromSlate(this.editCache[translationId].data.draftTranslation);
    let sourcePlaceholders = this.editCache[translationId].data.parts.filter(_ => _.type === 'PLACEHOLDER');
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

    this.editCache[translationId].missingPlaceholders = missingPlaceholders;
  }

  ngOnInit(): void {
    this.updateEditCache();
  }
}
