import glob from 'fast-glob';
import banner from 'rollup-plugin-banner';
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';

const packages = glob.sync('packages/**/index.ts');
const filename = (path) =>
  path.replace(/\//g, '.').replace('index.ts', 'main.js');

export default packages.map((path) => ({
  input: path,
  output: {
    file: `dist/${filename(path)}`,
    format: 'cjs',
  },
  external: ['buttons', 'http'],
  plugins: [typescript(), terser(), banner({ file: './LICENSE' })],
}));
