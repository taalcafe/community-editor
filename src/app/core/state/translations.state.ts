import { State, Action, StateContext } from '@ngxs/store';
import { Translation } from 'src/app/upload-translation-file/models/translation';

// Actions
export class LoadTranslations {
    static readonly type = '[Translations] Load Translations';
    constructor(public translations: Translation[], public fileName: string) {}
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
    feedZebra({ getState, patchState }, action: LoadTranslations) {
        patchState({ translations: action.translations, fileName: action.fileName })
    }
}