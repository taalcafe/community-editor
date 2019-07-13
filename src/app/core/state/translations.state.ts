import { State, Action, StateContext } from '@ngxs/store';
import { Translation } from 'src/app/upload-translation-file/models/translation';

// Actions
export class LoadTranslations {
    static readonly type = '[Translations] Load Translations';
    constructor(public translations: Translation[], public fileName: string) {}
}

export class UpdateTranslation {
  static readonly type = '[Translations] Update Translation';
  constructor(public index: number, public target: any) {}
}

// State Model
export interface TranslationsStateModel {
    translations: Translation[];
    fileName: string;
}

// State
@State<TranslationsStateModel>({
  name: 'translations',
  defaults: {
    translations: [],
    fileName: undefined
  }
})
export class TranslationsState {
    @Action(LoadTranslations)
    loadTranslations({ patchState }, action: LoadTranslations) {
        patchState({ translations: action.translations, fileName: action.fileName })
    }

    @Action(UpdateTranslation)
    updateTranslation({ getState, patchState }, action: UpdateTranslation) {
        let translations = getState().translations;
        translations[action.index].target = action.target;
        // patchState({ translations: action.translations, fileName: action.fileName })
    }
}