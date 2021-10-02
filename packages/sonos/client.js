const http = require('http');

/**
 * Responsible for generating the SetEQ action
 *
 * @param {string} EQType The EQ property to change
 * @param {*} value  The desired value for the EQ property
 * @returns {string}
 */
function createSetEQAction(EQType, value) {
  return [
    '<u:SetEQ xmlns:u="urn:schemas-upnp-org:service:RenderingControl:1">',
    '<InstanceID>0</InstanceID>',
    '<EQType>' + EQType + '</EQType>',
    '<DesiredValue>' + value + '</DesiredValue>',
    '</u:SetEQ>',
  ].join('');
}

/**
 * Responsible for generating the GetEQ action
 *
 * @param {string} EQType The EQ property to request
 * @returns {string}
 */
function createGetEQAction(EQType) {
  return [
    '<u:GetEQ xmlns:u="urn:schemas-upnp-org:service:RenderingControl:1">',
    '<InstanceID>0</InstanceID>',
    '<EQType>' + EQType + '</EQType>',
    '</u:GetEQ>',
  ].join('');
}

/**
 * Responsible for creating a SOAP envelope
 *
 * @param {string} actionBody
 * @returns {string}
 */
function createSoapEnvelope(actionBody) {
  return [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">',
    '<s:Body>',
    actionBody,
    '</s:Body>',
    '</s:Envelope>'
  ].join('');
}

/**
 * Responsible for toggling an EQ value
 *
 * @param {object}   config   Sonos configuration
 * @param {string}   EQType   The EQ property to toggle
 * @param {Function} callback Function to call upon completion
 */
function toggleEQValue(config, EQType, callback) {
  getEQValue(config, EQType, function (err, result) {
    if (err) {
      return callback(err);
    }

    const newValue = result.CurrentValue ? 0 : 1;
    setEQValue(config, EQType, newValue, callback);
  });
};

/**
 * Responsible for retrieving an EQ value
 *
 * @param {object}   config   Sonos configuration
 * @param {string}   EQType   The EQ property to toggle
 * @param {Function} callback Function to call upon completion
 */
function getEQValue(config, EQType, callback) {
  makeRequest({
      host: config.ip,
      url: '/MediaRenderer/RenderingControl/Control',
      content: createGetEQAction(EQType),
      headers: {
        soapaction: 'RenderingControl:1#GetEQ'
      }
    },
    function (err, result) {
      if (err) {
        return callback(err);
      }

      const currentValue = +(/<CurrentValue>(.*?)<\/CurrentValue>/g.exec(result)[1]);
      callback(null, {
        CurrentValue: currentValue
      });
    });
}

/**
 * Responsible for setting an EQ value
 *
 * @param {object}   config   Sonos configuration
 * @param {string}   EQType   The EQ property to toggle
 * @param {Function} callback Function to call upon completion
 */
function setEQValue(config, EQType, value, callback) {
  const newValue = +value;

  makeRequest({
      host: config.ip,
      url: '/MediaRenderer/RenderingControl/Control',
      content: createSetEQAction(EQType, newValue),
      headers: {
        soapaction: 'RenderingControl:1#SetEQ'
      }
    },
    function (err) {
      if (err) {
        return callback(err)
      }

      callback(null, {
        CurrentValue: newValue
      });
    });
}

/**
 * Provides a standardised helper for interacting with the Sonos SOAP API
 *
 * @param {object}   options  Request options
 * @param {Function} callback Function to call upon request completion
 */
function makeRequest(options, callback) {
  http.makeRequest({
    url: 'http://' + options.host + ':1400' + options.url,
    method: 'POST',
    headers: {
      Host: options.host + ':1400',
      soapaction: 'urn:schemas-upnp-org:service:' + options.headers.soapaction,
      'Content-Type': 'text/xml; charset="utf-8"'
    },
    content: createSoapEnvelope(options.content)
  }, function (err, result) {
    if (err) {
      return callback(err);
    }

    if (result.statusCode !== 200) {
      return callback(new Error(result.content));
    }

    callback(null, result.content);
  });
};

/**
 * Creates a basic Sonos client
 *
 * @param {object} config Configuration options for the sonos client
 * @returns {object}
 */
module.exports = function (config) {
  return {
    getEQValue: getEQValue.bind(null, config),
    setEQValue: setEQValue.bind(null, config),
    toggleEQValue: toggleEQValue.bind(null, config)
  };
};
