declare module 'http' {
  export type HTTPMethod =
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'HEAD'
    | 'OPTIONS'
    | 'TRACE';

  export interface MakeRequestOptions {
    url: string;
    headers: {
      [key: string]: unknown;
    };
    content?: string;
    method?: HTTPMethod;
  }

  export interface MakeRequestResponse {
    statusCode: number;
    statusMessage: string;
    headers: {
      _?: string[];
    };
    content: string;
  }

  export type MakeRequestCallback = (
    err: Error | null,
    response?: MakeRequestResponse
  ) => void;

  export function makeRequest(
    options: MakeRequestOptions,
    callback: MakeRequestCallback
  ): void;
}
