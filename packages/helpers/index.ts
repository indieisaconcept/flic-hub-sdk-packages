import buttonManager, { Button, ButtonEvent } from 'buttons';
import { IButtonCommands } from './types';

const decode = decodeURIComponent;

/**
 * Responsible for extracting configuration from a button name assuming
 * configuration is passed as a query string argument.
 *
 * example:
 *  sdk://sonos?ip=192.168.1&key=value
 *
 * @param {string} name
 * @returns {object}
 */
const getConfiguration = (name: string) => {
  const config = name.split('?')[1];

  if (!config) {
    return {};
  }

  return config.split('&').reduce<Record<string, string>>((acc, current) => {
    const [key, val] = current.split('=');
    acc[decode(key)] = decode(val);
    return acc;
  }, {});
};

/**
 * Responsible for determining what type of button event has been generated
 * @param event
 * @returns {string}
 */
const getClickType = (event: ButtonEvent): string =>
  event.isSingleClick
    ? 'onClick'
    : event.isDoubleClick
    ? 'onDoubleClick'
    : 'onHold';

/**
 * Responsible for registering a new module.
 *
 * @param {string} namespace The command namespace
 * @param {object} commands  Command configuration
 */
export const registerButtonPackage = (
  namespace: string,
  commands: IButtonCommands
): void => {
  const namespaceRegex = new RegExp('^sdk://' + namespace, 'i');

  buttonManager.on('buttonSingleOrDoubleClickOrHold', (event: ButtonEvent) => {
    const button: Button = buttonManager.getButton(event.bdaddr);

    if (!namespaceRegex.test(button.name)) {
      return;
    }

    const clickType = getClickType(event);
    const command = commands[clickType];

    if (command) {
      const config = getConfiguration(button.name);
      command(config, button);
    }
  });
};
