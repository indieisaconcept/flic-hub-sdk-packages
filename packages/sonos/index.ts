import { registerButtonPackage } from '../helpers';
import client from './client';
import { IConfig, IEQResponse } from './types';

/**
 * Generic callback helper
 *
 * @param {Error}  err    An error instance
 * @param {object} result A result
 * @returns
 */
const callback = (
  label: string,
  err: Error | null,
  { CurrentValue }: IEQResponse = {}
) => {
  if (err) {
    return console.log(err);
  }

  console.log(`Sonos | ${label} | ${CurrentValue}`);
};

registerButtonPackage({
  namespace: 'sonos',
  events: {
    onClick: (config: IConfig) => {
      const sonos = client(config);

      sonos.toggleEQValue('SurroundEnable', (err, result) => {
        if (err) {
          return console.log(err);
        }

        sonos.setEQValue(
          'SubEnable',
          result?.CurrentValue,
          callback.bind(null, 'Home Theatre')
        );
      });
    },
    onDoubleClick: (config: IConfig) =>
      client(config).toggleEQValue(
        'SurroundEnable',
        callback.bind(null, 'Surround')
      ),
    onHold: (config: IConfig) =>
      client(config).toggleEQValue(
        'SubEnable',
        callback.bind(null, 'Subwoofer')
      ),
  },
});
