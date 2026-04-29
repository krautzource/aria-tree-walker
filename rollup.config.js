import terser from "@rollup/plugin-terser";

const input = 'lib/navigator.js';

export default [
  {
    input,
    output: {
      file: 'dist/aria-tree-walker.js',
      format: 'esm',
    },
    plugins: [terser()],
  },
];
