import { State, Action, StateContext } from '@ngxs/store';
import { Translation } from 'src/app/upload-translation-file/models/translation';
import { TaalPart } from 'taal-editor';
import { TranslationMessagesFileFactory } from 'src/app/ngx-lib/api';
import { saveAs } from 'file-saver/src/FileSaver';
import { denormalizeInto } from 'src/app/upload-translation-file/handler/denormalizer';
import ISO6391 from 'iso-639-1';

// Actions
export class LoadTranslations {
    static readonly type = '[Translations] Load Translations';
    constructor(public translations: Translation[], public fileName: string, public xml: string, public sourceLanguage: string, public targetLanguage: string) {}
}

export class UpdateTranslation {
  static readonly type = '[Translations] Update Translation';
  constructor(public index: number, public target: TaalPart[]) {}
}

export class DownloadTranslationsFile {
  static readonly type = '[Translations] Download Translations File';
  constructor() {}
}

// State Model
export interface TranslationsStateModel {
    translations: Translation[];
    fileName: string;
    inputXml: string;
    sourceLanguage: string;
    targetLanguage: string;
    translationsCount: number;
    missingTranslationsMap: { [id: string]: boolean; }
}

// State
@State<TranslationsStateModel>({
  name: 'translations',
  defaults: {
    translations: [],
    fileName: undefined,
    inputXml: undefined,
    sourceLanguage: undefined,
    targetLanguage: undefined,
    translationsCount: 0,
    missingTranslationsMap: {}
  }
})
export class TranslationsState {
    @Action(LoadTranslations)
    loadTranslations({ patchState }, action: LoadTranslations) {
      let sourceLanguage = action.sourceLanguage ? (<any>ISO6391).getName(action.sourceLanguage) : undefined;
      let targetLanguage = action.targetLanguage ? (<any>ISO6391).getName(action.targetLanguage) : undefined;

      let translationsCount = action.translations.length;
      let missingTranslationsMap = {};
      action.translations
        .filter(_ => !_.targetParts || (_.targetParts.length < 1))
        .map(_ => _.translationId)
        .forEach(_ => missingTranslationsMap[_] = true);

      patchState({
        translations: action.translations,
        fileName: action.fileName,
        inputXml: action.xml,
        sourceLanguage: sourceLanguage,
        targetLanguage: targetLanguage,
        translationsCount,
        missingTranslationsMap
      })
    }

    @Action(UpdateTranslation)
    updateTranslation({ getState, patchState }, action: UpdateTranslation) {
      let translations = getState().translations;
      let updatedTranslation = translations[action.index];
      let missingTranslationsMap = getState().missingTranslationsMap
      updatedTranslation.targetParts = action.target;
      if (missingTranslationsMap[updatedTranslation.translationId]) {
        delete missingTranslationsMap[updatedTranslation.translationId]
      }

      patchState({ missingTranslationsMap })
    }

    @Action(DownloadTranslationsFile)
    downloadTranslationsFile({ getState, patchState }) {
      let translations = getState().translations;
      const file = new TranslationMessagesFileFactory()
        .createFileFromUnknownFormatFileContent(getState().inputXml, 'nop', 'utf8')
        .createTranslationFileForLang('bg', 'nop', false, true);

      denormalizeInto(translations, file);

      const translatedContent = file.editedContent(true);
      var blob = new Blob([translatedContent], {
        type: "text/xml;charset=utf-8"
       });
       
       saveAs(blob, getState().fileName);
    }
}