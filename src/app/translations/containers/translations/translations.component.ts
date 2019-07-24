import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Translation } from 'src/app/upload-translation-file/models/translation';
import { Observable } from 'apollo-link';
import { Select, Store } from '@ngxs/store';
import { UpdateTranslation, DownloadTranslationsFile } from 'src/app/core/state/translations.state';

@Component({
  selector: 'app-translations',
  templateUrl: './translations.component.html',
  styleUrls: ['./translations.component.less']
})
export class TranslationsComponent implements OnInit {

  @Select(state => state.translations.translations)
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

  constructor(private store: Store, private router: Router) { }

  ngOnInit() {
  }

  onBack() {
    this.router.navigate(['']);
  }

  saveTranslation(event: any) {
    this.store.dispatch(new UpdateTranslation(event.translationId, event.target, event.icuExpressions));
  }

  download() {
    this.store.dispatch(new DownloadTranslationsFile());
  }

  getObjectKeysLength(obj: any) {
    return Object.keys(obj).length;
  }

}
