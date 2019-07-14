import { Translation } from '../models/translation';
import { ITranslationMessagesFile } from 'src/app/ngx-lib/api';
import { ITaalMessagePart } from '../models/taal-message-part';
import { ParsedMessage } from 'src/app/ngx-lib/impl/parsed-message';


export const denormalizeInto = (
  translations: Translation[],
  transFile: ITranslationMessagesFile
) => {
  translations = translations.sort((t1, t2) => t2.order - t1.order);

  let lastTranslation: Translation = null;
  transFile.forEachTransUnit(tu => {
    const translation = translations.find(t => t.translationId === tu.id);
    let parts: ITaalMessagePart[] = null;
    if (translation) {
      parts = translation.targetParts;
      lastTranslation = translation;
    } else {
      console.debug(`${tu.id} must be ICU expression.`);
      const icuExpression = lastTranslation.icuExpressions.find(
        icuEx => icuEx.id === tu.id
      );
      if (!icuExpression) {
        throw new Error(
          `Neither translation, nor ICU expression matches id ${tu.id}`
        );
      }

      parts = icuExpression.parts;
    }

    const aggregatedParts = parts.reduce(
      (total, part) => total.concat(part.value),
      ''
    );
    const translatedMsg = (tu.sourceContentNormalized() as ParsedMessage).translate(
      aggregatedParts
    );

    tu.translate(translatedMsg);
  });
};
