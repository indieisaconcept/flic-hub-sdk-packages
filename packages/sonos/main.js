/**
 * MIT License
 *
 * Copyright (c) 2021 Jonathan Barnett
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * -----------------------------------------------------------------------------
 * In-order to make use of this package name your button as follows
 *
 * sdk://sonos?ip=<ip-address-of-soundbar>
 *
 * onClick       : Toggle surround & subwoofer ( settings are synced )
 * onDoubleClick : Toggle surround
 * onHold        : Toggle subwoofer
 * -----------------------------------------------------------------------------
 */
const helpers = require('../helpers/main');
const client = require('./client');

/**
 * Generic callback helper
 *
 * @param {string} label  The name of the action
 * @param {Error}  err    An error instance
 * @param {object} result A result
 * @returns
 */
const callback = function (name, err, result) {
  if (err) {
    return console.log(err);
  }

  console.log('Sonos | ' + name + ' | ' + Boolean(result.CurrentValue));
}

helpers.registerButtonPackage('sonos', {
  onClick: function (config) {
    const sonos = client(config);

    sonos.toggleEQValue('SurroundEnable', function (err, result) {
      if (err) {
        return console.log(err);
      }

      sonos.setEQValue(
        'SubEnable',
        result.CurrentValue,
        callback.bind(null, 'Home Theatre')
      )
    });
  },
  onDoubleClick: function (config, button) {
    const sonos = client(config);
    sonos.toggleEQValue('SurroundEnable', callback.bind(null, 'Surround'));
  },
  onHold: function (config, button) {
    const sonos = client(config);
    sonos.toggleEQValue('SubEnable', callback.bind(null, 'Subwoofer'));
  }
});
