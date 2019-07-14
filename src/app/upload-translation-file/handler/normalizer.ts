


import { ParsedMessagePart, ParsedMessagePartType } from 'src/app/ngx-lib/impl/parsed-message-part';
import { ParsedMessagePartPlaceholder } from 'src/app/ngx-lib/impl/parsed-message-part-placeholder';
import { ITransUnit } from 'src/app/ngx-lib/api';
import { ParsedMessage } from 'src/app/ngx-lib/impl/parsed-message';
import { ITaalMessagePart } from '../models/taal-message-part';
import { Translation } from '../models/translation';

const toTaalPart = (p: ParsedMessagePart) => {
  const part = <ITaalMessagePart>{
    type: p.type,
    value: p.asDisplayString(),
  };

  if (p instanceof ParsedMessagePartPlaceholder) {
    part.meta = p.disp();
  }

  return part;
};

export const normalize = (transUnits: ITransUnit[]): Translation[] => {
  const normalizedTUs: Translation[] = [];
  for (let i = 0; i < transUnits.length; i += 1) {
    const tu = transUnits[i];
    const normalized = tu.sourceContentNormalized() as ParsedMessage;
    const targetNormalized = tu.targetContentNormalized() as ParsedMessage;

    const parts = normalized.parts();
    const targetParts = targetNormalized.parts();
    const [firstPart, ...rest] = parts;

    if (firstPart.type === ParsedMessagePartType.ICU_MESSAGE) {
      // Add as ICU message to previous translation
      const prev = normalizedTUs[normalizedTUs.length - 1];
      prev.icuExpressions.push({
        id: tu.id,
        parts: rest.map(p => toTaalPart(p)),
      });
    } else {
      const translation: any = {
        translationId: tu.id,
        meaning: tu.meaning(),
        description: tu.description(),
        order: i
      }

      let processedSourceParts: ITaalMessagePart[] = null;
      processedSourceParts = normalized.parts().map(p => toTaalPart(p));

      let processedTargetParts: ITaalMessagePart[] = null;
      processedTargetParts = targetNormalized.parts().map(p => toTaalPart(p));

      translation.parts = processedSourceParts;
      translation.sourceParts = processedSourceParts;
      translation.targetParts = processedTargetParts;
      translation.icuExpressions = [];
      normalizedTUs.push(translation);
    }
  }

  return normalizedTUs;
};
