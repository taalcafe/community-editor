import { State, Action, StateContext } from '@ngxs/store';
import { Translation } from 'src/app/upload-translation-file/models/translation';
import { TaalPart } from 'taal-editor';
import { TranslationMessagesFileFactory } from 'src/app/ngx-lib/api';
import { saveAs } from 'file-saver/src/FileSaver';
import { denormalizeInto } from 'src/app/upload-translation-file/handler/denormalizer';

// Actions
export class LoadTranslations {
    static readonly type = '[Translations] Load Translations';
    constructor(public translations: Translation[], public fileName: string, public xml: string) {}
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
}

// State
@State<TranslationsStateModel>({
  name: 'translations',
  defaults: {
    translations: [],
    fileName: undefined,
    inputXml: undefined
  }
})
export class TranslationsState {
    @Action(LoadTranslations)
    loadTranslations({ patchState }, action: LoadTranslations) {
      patchState({ translations: action.translations, fileName: action.fileName, inputXml: action.xml })
    }

    @Action(UpdateTranslation)
    updateTranslation({ getState, patchState }, action: UpdateTranslation) {
      let translations = getState().translations;
      translations[action.index].targetParts = action.target;
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