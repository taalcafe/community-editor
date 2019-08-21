import { State, Action, StateContext } from '@ngxs/store';
import { Translation } from 'src/app/upload-translation-file/models/translation';
import { TaalPart } from 'taal-editor';
import { TranslationMessagesFileFactory } from 'src/app/ngx-lib/api';
import { saveAs } from 'file-saver/src/FileSaver';
import { denormalizeInto } from 'src/app/upload-translation-file/handler/denormalizer';
import ISO6391 from 'iso-639-1';
import { ITaalMessagePart } from 'src/app/upload-translation-file/models/taal-message-part';
import { ITaalIcuMessage } from 'src/app/upload-translation-file/models/taal-icu-message';
import produce from 'immer';
// Actions
export class LoadTranslations {
    static readonly type = '[Translations] Load Translations';
    constructor(public translations: Translation[], public fileName: string, public xml: string, public sourceLanguage: string, public targetLanguage: string) {}
}
export class UpdateEditMap {
  static readonly type = '[Translations] Update Edit Map';
  constructor(public translationId: string, public edit: boolean) {}
}
export class UpdateMissingPlaceholdersMap {
    static readonly type = '[Translations] Update Missing Placeholders Map';
    constructor(public translationId: string, public targetParts: ITaalMessagePart[]) {}
}
export class UpdateMissingICUExpressionsMap {
  static readonly type = '[Translations] Update Missing ICU Expressions Map';
  constructor(public translationId: string, public targetParts: ITaalMessagePart[]) {}
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
    missingTranslationsMap: { [id: string]: boolean; };
    invalidTranslationsMap: { [id: string]: string; };

    editMap: Map<string, boolean>;
    missingPlaceholdersMap: Map<string, any[]>;
    missingICUExpressionsMap: Map<string, ITaalIcuMessage[]>;
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
    invalidTranslationsMap: {},

    editMap: new Map(),
    missingPlaceholdersMap: new Map(),
    missingICUExpressionsMap: new Map()
  }
})
export class TranslationsState {
    @Action(LoadTranslations)
    loadTranslations({ patchState, dispatch }, action: LoadTranslations) {
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

    @Action(UpdateEditMap)
    updateEditMap({ getState, patchState }, action: UpdateEditMap) {

      const editMap = produce(getState().editMap, (draft: Map<string, boolean>) => {
        draft.set(action.translationId, action.edit);
      })

      patchState({ editMap })
    }

    @Action(UpdateMissingPlaceholdersMap)
    updateMissingPlaceholdersMap({ getState, patchState }, action: UpdateMissingPlaceholdersMap) {
      const missingPlaceholdersMap = produce(getState().missingPlaceholdersMap, (draft: Map<string, any[]>) => {
        const _ = draft.get(action.translationId);
        {
          let translation: Translation = getState().translations.find(_ => _.translationId === action.translationId);
          let sourcePlaceholders = translation.parts.filter(_ => _.type === 'PLACEHOLDER');
          let targetPlaceholders = action.targetParts.filter(_ => _.type === 'PLACEHOLDER');
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
          
          draft.set(action.translationId, missingPlaceholders);
        }
      })

      patchState({ missingPlaceholdersMap })
    }

    @Action(UpdateMissingICUExpressionsMap)
    updateMissingICUExpressionsMap({ getState, patchState }, action: UpdateMissingICUExpressionsMap) {

      const missingICUExpressionsMap = produce(getState().missingICUExpressionsMap, (draft: Map<string, ITaalIcuMessage[]>) => {
        const _ = draft.get(action.translationId);
        {
          let translation: Translation = getState().translations.find(_ => _.translationId === action.translationId);
          let targetICUExpressions = action.targetParts.filter(_ => _.type === 'ICU_MESSAGE_REF');
    
          let missingICUExpressions = translation.targetIcuExpressions.filter(src => {
            return !targetICUExpressions.find(trg => {
              return trg.value === `<ICU-Message-Ref_${src.key}/>`
            })
          })

          draft.set(action.translationId, missingICUExpressions);
        }
      })
      
      patchState({ missingICUExpressionsMap })
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