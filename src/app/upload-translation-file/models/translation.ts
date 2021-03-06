import { ITaalIcuMessage } from './taal-icu-message';
import { ITaalMessagePart } from './taal-message-part';

export interface Translation {
  id: number;
  translationId: string;
  order: number;
  meaning: string | null;
  description: string | null;
  parts: ITaalMessagePart[];
  targetParts: ITaalMessagePart[];
  icuExpressions: ITaalIcuMessage[];
  targetIcuExpressions: ITaalIcuMessage[];
  language: string;
  checksum: string;
}