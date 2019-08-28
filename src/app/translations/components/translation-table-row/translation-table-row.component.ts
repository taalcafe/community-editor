import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { convertFromSlate } from 'taal-editor';
import { Subject, Observable } from 'rxjs';
import { Translation } from 'src/app/upload-translation-file/models/translation';
import { ITaalIcuMessage } from 'src/app/upload-translation-file/models/taal-icu-message';
import { ITaalMessagePart } from 'src/app/upload-translation-file/models/taal-message-part';
import { Store } from '@ngxs/store';
import { ParsedMessagePartType } from 'src/app/ngx-lib/impl/parsed-message-part';
import * as messageformat from 'messageformat-parser';

@Component({
  selector: '[translationTableRow]',
  templateUrl: './translation-table-row.component.html',
  styleUrls: ['./translation-table-row.component.less']
})
export class TranslationTableRowComponent implements OnInit {

  @Input() edit: boolean;
  @Input() translation$: Observable<Translation>;

  translationId: string;
  parts: ITaalMessagePart[];
  targetParts: ITaalMessagePart[];
  icuExpressions: ITaalIcuMessage[];
  targetIcuExpressions: ITaalIcuMessage[];
  icuExpressionTree: any;

  @Input() missingTranslation: boolean;
  @Input() invalidTranslation: boolean;

  @Input() missingPlaceholders: any[];
  @Input() missingICUExpressions: ITaalIcuMessage[];


  @Output() updateMissingPlaceholders: EventEmitter<ITaalMessagePart[]> = new EventEmitter();
  @Output() updateMissingICUExpressions: EventEmitter<ITaalMessagePart[]> = new EventEmitter();

  @Output() startEdit: EventEmitter<string> = new EventEmitter();
  @Output() saveEdit: EventEmitter<{ translationId: string, targetParts: ITaalMessagePart[], icuExpressionTree: any }> = new EventEmitter();
  @Output() undoEdit: EventEmitter<string> = new EventEmitter();

  taalEditorActionDispatcher: Subject<{ id: string, action: string, data: any }> = new Subject();

  save: Subject<void> = new Subject();

  draft: any;

  constructor(private store: Store) { }

  ngOnInit() {
    this.translation$
      .subscribe((_: Translation) => {
        this.translationId = _.translationId;
        this.parts = _.parts;
        this.targetParts = _.targetParts;
        this.icuExpressions = _.icuExpressions;
        this.targetIcuExpressions = _.targetIcuExpressions
        this.buildICUExpressionTree(_);
      })
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
    let targetParts = convertFromSlate(this.draft).parts;
    this.saveEdit.emit({
      translationId: this.translationId,
      targetParts: <any>targetParts,
      icuExpressionTree: this.icuExpressionTree
    });
  }

  undoEditFn() {
    this.saveEdit.emit({
      translationId: this.translationId,
      targetParts: this.targetParts,
      icuExpressionTree: this.icuExpressionTree
    });

    this.taalEditorActionDispatcher.next({
      id: this.translationId,
      action: 'UNDO',
      data: { }
    })
  }

  startEditFn() {
    this.startEdit.emit(this.translationId);
  }

  buildICUExpressionTree(translation: Translation): void {

      if (!translation.icuExpressions || !translation.icuExpressions.length) return;

      let icuExpressionParts = translation.icuExpressions[0].parts.map(_ => {
        return _.type === 'PLACEHOLDER' ?  `__taal__${this.stripCurlyBraces(_.value)}__taal__` : _.value
      });

      let result = messageformat.parse(icuExpressionParts.join(''));
      this.icuExpressionTree = result;
      this.icuExpressionTree
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

  private stripCurlyBraces(str: string) {
    return str.replace(/{|}/g, '')
  }
}