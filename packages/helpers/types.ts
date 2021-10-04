export type ButtonFunction = (config: Record<string, unknown>) => void;

export interface IButtonEvents {
  onClick?: ButtonFunction;
  onDoubleClick?: ButtonFunction;
  onHold?: ButtonFunction;
  [key: string]: ButtonFunction | undefined;
}

export interface IRegisterButtonPackage {
  namespace?: string;
  events: IButtonEvents;
}

export type registerButtonPackage = (options: IRegisterButtonPackage) => void;
