import { State, Action, StateContext } from '@ngxs/store';
import { Translation } from 'src/app/upload-translation-file/models/translation';
import { TaalPart } from 'taal-editor';
import { TranslationMessagesFileFactory } from 'src/app/ngx-lib/api';
import { saveAs } from 'file-saver/src/FileSaver';
import { denormalizeInto } from 'src/app/upload-translation-file/handler/denormalizer';
import ISO6391 from 'iso-639-1';
import { ITaalMessagePart } from 'src/app/upload-translation-file/models/taal-message-part';
import { ITaalIcuMessage } from 'src/app/upload-translation-file/models/taal-icu-message';

// Actions
export class LoadTranslations {
    static readonly type = '[Translations] Load Translations';
    constructor(public translations: Translation[], public fileName: string, public xml: string, public sourceLanguage: string, public targetLanguage: string) {}
}

export class UpdateTranslation {
  static readonly type = '[Translations] Update Translation';
  constructor(public translationId: string, public target: TaalPart[], public icuExpressions: ITaalIcuMessage[]) {}
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
    invalidTranslationsMap: { [id: string]: string; }
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
    
    missingTranslationsMap: {},
    invalidTranslationsMap: {}
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
      let updatedTranslation: Translation = translations.find(_ => _.translationId === action.translationId);

      let invalidTranslationsMap = getState().invalidTranslationsMap


      let sourceICUExpressionsCount = updatedTranslation.parts.filter(_ => _.type === 'ICU_MESSAGE_REF').length;
      let targetICUExpressionsCount = action.target.filter(_ => _.type === 'ICU_MESSAGE_REF').length;
      let sourcePlaceholdersCount = updatedTranslation.parts.filter(_ => _.type === 'PLACEHOLDER').length;
      let targetPlaceholdersCount = action.target.filter(_ => _.type === 'PLACEHOLDER').length;
      let icuExpressionsCountMatch = sourceICUExpressionsCount === targetICUExpressionsCount;
      let placeholdersCountMatch = sourcePlaceholdersCount === targetPlaceholdersCount;


      if(!action.target || !icuExpressionsCountMatch || !placeholdersCountMatch) {
          invalidTranslationsMap[updatedTranslation.translationId] = 'Missing translation parts';
      } else {
          delete invalidTranslationsMap[updatedTranslation.translationId]
      }
      
      let missingTranslationsMap = getState().missingTranslationsMap
      updatedTranslation.targetParts = <ITaalMessagePart[]>action.target;
      
      if(updatedTranslation.targetIcuExpressions && updatedTranslation.targetIcuExpressions.length)
        (updatedTranslation.targetIcuExpressions as any[])[0]['parts'] = action.icuExpressions;
      

      delete missingTranslationsMap[updatedTranslation.translationId]

      patchState({ missingTranslationsMap, invalidTranslationsMap })
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