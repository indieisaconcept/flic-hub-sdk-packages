import { makeRequest, MakeRequestCallback, MakeRequestOptions } from 'http';

import { EQCallback, IClientCommands, IConfig } from './types';

/**
 * Responsible for generating the SetEQ action
 *
 * @param {string} EQType The EQ property to change
 * @param {*} value  The desired value for the EQ property
 * @returns {string}
 */
const createSetEQAction = (EQType: string, value: unknown) =>
  [
    '<u:SetEQ xmlns:u="urn:schemas-upnp-org:service:RenderingControl:1">',
    '<InstanceID>0</InstanceID>',
    `<EQType>${EQType}</EQType>`,
    `<DesiredValue>${value}</DesiredValue>`,
    '</u:SetEQ>',
  ].join('');

/**
 * Responsible for generating the GetEQ action
 *
 * @param {string} EQType The EQ property to request
 * @returns {string}
 */
const createGetEQAction = (EQType: string) =>
  [
    '<u:GetEQ xmlns:u="urn:schemas-upnp-org:service:RenderingControl:1">',
    '<InstanceID>0</InstanceID>',
    `<EQType>${EQType}</EQType>`,
    '</u:GetEQ>',
  ].join('');

/**
 * Responsible for creating a SOAP envelope
 *
 * @param {string} actionBody
 * @returns {string}
 */
const createSoapEnvelope = (actionBody = '') =>
  [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">',
    `<s:Body>${actionBody}</s:Body>`,
    '</s:Envelope>',
  ].join('');

/**
 * Responsible for toggling an EQ value
 *
 * @param {object}   config   Sonos configuration
 * @param {string}   EQType   The EQ property to toggle
 * @param {Function} callback Function to call upon completion
 */
const toggleEQValue = (
  config: IConfig,
  EQType: string,
  callback: EQCallback
) => {
  getEQValue(config, EQType, (err, result) => {
    if (err) {
      return callback(err);
    }

    const newValue = +(result?.CurrentValue || '') ? 0 : 1;
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
const getEQValue = (config: IConfig, EQType: string, callback: EQCallback) => {
  request(
    {
      url: '/MediaRenderer/RenderingControl/Control',
      content: createGetEQAction(EQType),
      headers: {
        host: config.ip,
        soapaction: 'RenderingControl:1#GetEQ',
      },
    },
    (err, response) => {
      if (err) {
        return callback(err);
      }

      const currentValue: RegExpExecArray | null =
        /<CurrentValue>(.*?)<\/CurrentValue>/gi.exec(response?.content || '');

      callback(null, {
        EQType,
        CurrentValue: currentValue?.[1],
      });
    }
  );
};

/**
 * Responsible for setting an EQ value
 *
 * @param {object}   config   Sonos configuration
 * @param {string}   EQType   The EQ property to toggle
 * @param {Function} callback Function to call upon completion
 */
const setEQValue = (
  config: IConfig,
  EQType: string,
  value: unknown,
  callback: EQCallback
) => {
  request(
    {
      url: '/MediaRenderer/RenderingControl/Control',
      content: createSetEQAction(EQType, value),
      headers: {
        host: config.ip,
        soapaction: 'RenderingControl:1#SetEQ',
      },
    },
    (err: Error | null) => {
      if (err) {
        return callback(err);
      }

      getEQValue(config, EQType, callback);
    }
  );
};

/**
 * Provides a standardised helper for interacting with the Sonos SOAP API
 *
 * @param {object}   options  Request options
 * @param {Function} callback Function to call upon request completion
 */
const request = (
  options: MakeRequestOptions,
  callback: MakeRequestCallback
) => {
  makeRequest(
    {
      url: `http://${options.headers.host}:1400${options.url}`,
      method: 'POST',
      headers: {
        Host: `${options.headers.host}:1400`,
        soapaction: `urn:schemas-upnp-org:service:${options.headers.soapaction}`,
        'Content-Type': 'text/xml; charset="utf-8"',
      },
      content: createSoapEnvelope(options.content),
    },
    (err, result) => {
      if (err) {
        return callback(err);
      }

      if (result?.statusCode !== 200) {
        return callback(new Error(JSON.stringify(result)));
      }

      callback(null, result);
    }
  );
};

/**
 * Creates a basic Sonos client.
 *
 * @param {object} config Configuration options for the sonos client
 * @returns {object}
 */
export default (config: IConfig): IClientCommands => ({
  getEQValue: getEQValue.bind(null, config),
  setEQValue: setEQValue.bind(null, config),
  toggleEQValue: toggleEQValue.bind(null, config),
});
