import { ITaalMessagePart } from './taal-message-part';

export interface ITaalIcuMessage {
  id: string;
  parts: ITaalMessagePart[];
}
