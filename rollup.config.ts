// tslint:disable no-implicit-dependencies
import camelCase from 'lodash.camelcase';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';

// tslint:disable-next-line no-var-requires
const pkg = require('./package.json');

const libraryName = 'springy-svgy-buttons';

export default {
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: ['react', 'styled-components', 'react-spring'],
  input: `src/${libraryName}.ts`,
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: camelCase(libraryName),
      sourcemap: true,
    },
    { file: pkg.module, format: 'es', sourcemap: true },
  ],
  plugins: [
    // Allow json resolution
    json(),
    // Compile TypeScript files
    typescript({ useTsconfigDeclarationDir: true }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),

    // Resolve source maps to the original source
    sourceMaps(),
  ],
  watch: {
    include: 'src/**',
  },
};
