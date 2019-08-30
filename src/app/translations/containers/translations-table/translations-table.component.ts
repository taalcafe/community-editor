import { Component, OnInit, Input } from '@angular/core';
import { Translation } from 'src/app/upload-translation-file/models/translation';
import { ITaalMessagePart } from 'src/app/upload-translation-file/models/taal-message-part';
import { ParsedMessagePartType } from 'src/app/ngx-lib/impl/parsed-message-part';
import { UpdateTranslation, UpdateEditMap, UpdateMissingICUExpressionsMap, UpdateMissingPlaceholdersMap, TranslationsState, ChangePage, ChangePageSize } from 'src/app/core/state/translations.state';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ITaalIcuMessage } from 'src/app/upload-translation-file/models/taal-icu-message';

@Component({
  selector: 'app-translations-table',
  templateUrl: './translations-table.component.html',
  styleUrls: ['./translations-table.component.less']
})
export class TranslationsTableComponent implements OnInit {

  @Input() total: number;
  @Input() translations: Translation[];

  @Input() sourceLanguage: string;
  @Input() targetLanguage: string;

  @Input() missingTranslationsMap: { [key: string]: boolean };
  @Input() invalidTranslationsMap: { [key: string]: any };
  
  @Input() missingPlaceholdersMap: Map<string, any[]>;
  @Input() missingICUExpressionsMap: Map<string, ITaalIcuMessage[]>;

  @Select(state => state.translations.editMap)
  editMap$: Observable<Map<string, boolean>>;

  @Select(state => state.translations.pageIndex)
  pageIndex$: Observable<Map<string, boolean>>;

  constructor(private store: Store) { }

  ngOnInit(): void { }

  startEdit(translationId: string): void {
    this.store.dispatch(new UpdateEditMap(translationId, true));
  }

  saveEdit(payload: { translationId: string, targetParts: ITaalMessagePart[], icuExpressionTree: any }): void {
    this.store.dispatch(new UpdateEditMap(payload.translationId, false));

    let icuExpression;
    if (payload.icuExpressionTree) {
      icuExpression = this.unparseICU(payload.icuExpressionTree);
    } 
    
    this.store.dispatch(
      new UpdateTranslation(
        payload.translationId,
        payload.targetParts || [],
        icuExpression ? [icuExpression] : []
      ));
  }

  unparseICU(expressionTree: any): ITaalMessagePart {
    let expressionTreeRootNode = expressionTree[0];
    let reducedTokens = expressionTreeRootNode.cases.reduce((prev, curr, i) => {
      let prevValue = i > 1 ? prev : `${prev.key} {${prev.parts.map(_ => _.value)}}`;
      return prevValue += ` ${curr.key} {${curr.parts.map(_ => _.value)}}`;
    })
    let result = `{${expressionTreeRootNode.arg}, ${expressionTreeRootNode.type}, ${reducedTokens} }`;

    return { type: ParsedMessagePartType.TEXT, key: '1', value: result };
  }

  updateMissingPlaceholders(targetParts: ITaalMessagePart[], translationId: string) {
    this.store.dispatch(new UpdateMissingPlaceholdersMap(translationId, targetParts));
  }

  updateMissingICUExpressions(targetParts: ITaalMessagePart[], translationId: string) {
    this.store.dispatch(new UpdateMissingICUExpressionsMap(translationId, targetParts));
  }

  getTranslationObservableByTranslationId(translationId: string): Observable<Translation> {
    return this.store.select(TranslationsState.translationById(translationId))
  }

  onPageChange(page: number) {
    this.store.dispatch(new ChangePage(page))
  }

  onPageSizeChange(size: number) {
    this.store.dispatch(new ChangePageSize(size))
  }
}
