import { defineConfig } from '@rslib/core';

export default defineConfig({
  lib: [
    {
      format: 'esm',
      syntax: 'es2022',
      dts: true,
    },
  ],
  source:{
    entry: {
      'loaders/ignore-css-loader': './src/loaders/ignore-css-loader.ts',
      'polyfills':'./src/polyfills.js',
      index: './src/index.ts'
    }
  }
});
