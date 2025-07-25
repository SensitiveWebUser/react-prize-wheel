/**
 * @fileoverview Rollup configuration for building the React Prize Wheel library
 *
 * @description Builds the library in multiple formats:
 * - CommonJS (dist/index.js) - for Node.js environments
 * - ES Modules (dist/index.esm.js) - for modern bundlers
 * - UMD (dist/index.umd.js) - for browser scripts
 *
 * Features:
 * - TypeScript compilation with type definitions
 * - External peer dependencies (React, React DOM)
 * - Source maps for debugging
 * - Minification for production builds
 */

import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve({
      browser: true,
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationMap: true,
      outDir: 'dist',
    }),
    terser(),
  ],
  external: ['react', 'react-dom'],
};
