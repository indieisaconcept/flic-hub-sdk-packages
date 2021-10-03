export interface IConfig {
  [key: string]: unknown;
}

export interface IEQResponse {
  EQType?: string;
  CurrentValue?: string | null;
}

export type EQCallback = (err: Error | null, result?: IEQResponse) => void;

export type EQGetFunction = (EQType: string, callback: EQCallback) => void;

export type EQSetFunction = (
  EQType: string,
  value: unknown,
  callback: EQCallback
) => void;

export interface IClientCommands {
  getEQValue: EQGetFunction;
  setEQValue: EQSetFunction;
  toggleEQValue: EQGetFunction;
}
