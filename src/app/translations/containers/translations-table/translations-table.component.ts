import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Translation } from 'src/app/upload-translation-file/models/translation';
import { convertFromSlate, TaalPart } from 'taal-editor';
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

  saveEdit(payload: { translationId: string, draft: any }): void {
    this.editCache[payload.translationId].edit = false;
    let targetParts = convertFromSlate(payload.draft)

    let icuExpression;
    if (this.editCache[payload.translationId].icuExpressionTree) {
      icuExpression = this.unparseICU(this.editCache[payload.translationId].icuExpressionTree);
    } 

    this.saveTranslation.emit({
      translationId: payload.translationId,
      target: targetParts.parts,
      icuExpressions: [icuExpression]
    })
    this.mapOfExpandData[payload.translationId] = false;
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

  ngOnInit(): void {
    this.updateEditCache();
  }
}
