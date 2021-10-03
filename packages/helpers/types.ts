import { ButtonFunction } from 'buttons';

export interface IButtonCommands {
  onClick: ButtonFunction;
  onDoubleClick: ButtonFunction;
  onHold: ButtonFunction;
  [key: string]: ButtonFunction | undefined;
}
