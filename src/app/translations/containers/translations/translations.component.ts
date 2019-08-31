import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Translation } from 'src/app/upload-translation-file/models/translation';
import { Observable } from 'apollo-link';
import { Select, Store } from '@ngxs/store';
import { DownloadTranslationsFile, ChangeTab } from 'src/app/core/state/translations.state';
import { ITaalIcuMessage } from 'src/app/upload-translation-file/models/taal-icu-message';

@Component({
  selector: 'app-translations',
  templateUrl: './translations.component.html',
  styleUrls: ['./translations.component.less']
})
export class TranslationsComponent implements OnInit {

  @Select(state => state.translations.tabIndex)
  tabIndex$: Observable<number>;

  @Select(state => state.translations.totalTranslations)
  totalTranslations$: Observable<Translation[]>;

  @Select(state => state.translations.pagedTranslations)
  translations$: Observable<Translation[]>;

  @Select(state => state.translations.sourceLanguage)
  sourceLanguage$: Observable<string>;
  @Select(state => state.translations.targetLanguage)
  targetLanguage$: Observable<string>;

  @Select(state => state.translations.translationsCount)
  translationsCount$: Observable<number>;

  @Select(state => state.translations.missingTranslationsMap)
  missingTranslationsMap$: Observable<{[id: string]: boolean;}>;
  @Select(state => state.translations.invalidTranslationsMap)
  invalidTranslationsMap$: Observable<{[id: string]: string;}>;

  @Select(state => state.translations.missingPlaceholdersMap)
  missingPlaceholdersMap$: Observable<Map<string, any[]>>;
  @Select(state => state.translations.missingICUExpressionsMap)
  missingICUExpressionsMap$: Observable<Map<string, ITaalIcuMessage[]>>;

  @Select(state => state.translations.downloadFileStatus)
  downloadFileStatus$: Observable<boolean>;
  @Select(state => state.translations.downloadFilePending)
  downloadFilePending$: Observable<boolean>;

  constructor(private store: Store, private router: Router) { }

  ngOnInit() { }

  onBack() {
    this.router.navigate(['']);
  }

  download() {
    this.store.dispatch(new DownloadTranslationsFile());
  }

  getObjectKeysLength(obj: any) {
    return Object.keys(obj).length;
  }

  onTabChange(tabIndex: number) {
    this.store.dispatch(new ChangeTab(tabIndex))
  }

}
