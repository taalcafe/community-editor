import { ParsedMessagePartType } from '../../ngx-lib/impl/parsed-message-part';

export interface ITaalMessagePart {
  type: ParsedMessagePartType;
  meta?: string | null;
  value: any;
  key: string;
}
