declare module 'buttons' {
  export type ButtonFunction = (
    config: Record<string, unknown>,
    button: Button
  ) => void;

  export interface ButtonEvent {
    bdaddr: string;
    isSingleClick?: boolean;
    isDoubleClick?: boolean;
    isHold?: boolean;
  }

  export interface Button {
    bdaddr: string; // Device address of button
    serialNumber: string; // Serial number
    color: string; // Colour of the button (lowercase)
    name: string; // The user assigned button name
    activeDisconnect: boolean; // The user has explicitly disconnected the button
    connected: boolean; // The connection to the button is currently established
    ready: boolean; // The connection is verified (see buttonReady)
    batteryStatus: number | null; // Battery level in percent (0-100), or null if unknown
    firmwareVersion: number | null; // Firmware version of button, or null if unknown
    flicVersion: number; // Flic version (1 or 2)
    uuid: string; // A 32 characters long hex string, unique for every button
    key: string; // A 40 characters long hex string (only for Flic 2)
  }

  export interface ButtonPairing {
    bdaddr: string; // Device address of button
    serialNumber: string; // Serial number
    color: string; // Colour of the button (lowercase)
    firmwareVersion: number; // Last known firmware version of button
    uuid: string; // A 32 characters long hex string, unique for every button
    key: string; // A 40 characters long hex string
  }

  export type ButtonEventCallback = (event: ButtonEvent) => void;
  export type EmptyCallback = () => void;

  export type ButtonEventNames =
    | 'buttonAdded'
    | 'buttonUpdated'
    | 'buttonDeleted'
    | 'buttonConnected'
    | 'buttonReady'
    | 'buttonDisconnected'
    | 'buttonDown'
    | 'buttonUp'
    | 'buttonClickOrHold'
    | 'buttonSingleOrDoubleClick'
    | 'buttonSingleOrDoubleClickOrHold';

  export function on(
    event: ButtonEventNames,
    callback: ButtonEventCallback
  ): void;
  export function getButton(bdaddr: string): Button;
  export function getButtons(): Button[];
  export function importFlic2Pairings(
    pairings: ButtonPairing[],
    callback?: EmptyCallback
  ): void;
}
