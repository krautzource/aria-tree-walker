import { terser } from 'rollup-plugin-terser';

const input = 'lib/navigator.js';

export default [
  {
    input,
    output: {
      file: 'dist/aria-tree-walker.iife.js',
      format: 'iife',
      name: 'AriaTreeWalker',
    },
    plugins: [terser()],
  },
  {
    input,
    output: {
      file: 'dist/aria-tree-walker.esm.js',
      format: 'esm',
    },
    plugins: [terser()],
  },
  {
    input,
    output: {
      file: 'dist/aria-tree-walker.cjs.js',
      format: 'cjs',
    },
    plugins: [terser()],
  },
];
