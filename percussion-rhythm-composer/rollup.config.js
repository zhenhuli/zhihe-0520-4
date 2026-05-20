import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import terser from '@rollup/plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/js/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    name: 'RhythmComposer',
    sourcemap: true
  },
  plugins: [
    resolve(),
    commonjs(),
    copy({
      targets: [
        { src: 'public/index.html', dest: 'dist' },
        { src: 'src/css/style.css', dest: 'dist' }
      ]
    }),
    production && terser()
  ],
  watch: {
    clearScreen: false
  }
};
