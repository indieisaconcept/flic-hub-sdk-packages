const decode = decodeURIComponent;
const buttonManager = require('buttons');

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
function getConfiguration(name) {
  const config = name.split('?')[1];

  if (!config) {
    return {};
  }

  return config.split('&').reduce(function (acc, current) {
    const tokens = current.split('=');
    const key = tokens[0];
    const val = tokens[1];

    acc[decode(key)] = decode(val);
    return acc;
  }, {});
}

/**
 * Responsible for determining what type of button event has been generated
 * @param event
 * @returns {string}
 */
function getClickType(event) {
  return event.isSingleClick ? 'onClick' : event.isDoubleClick ? 'onDoubleClick' : 'onHold';
}

module.exports = {
  /**
   * Responsible for registering a new module.
   *
   * @param {string} namespace The command namespace
   * @param {object} commands  Command configuration
   */
  registerButtonPackage: function (namespace, commands) {
    const namespaceRegex = new RegExp('^sdk://' + namespace, 'i');

    buttonManager.on('buttonSingleOrDoubleClickOrHold', function (obj) {
      const button = buttonManager.getButton(obj.bdaddr);

      if (!namespaceRegex.test(button.name)) {
        return;
      }

      const clickType = getClickType(obj);
      const command = commands[clickType];

      if (command) {
        const config = getConfiguration(button.name);
        command(config, button);
      }
    });
  }
};
