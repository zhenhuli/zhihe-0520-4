import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import css from 'rollup-plugin-css-only';
import terser from '@rollup/plugin-terser';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/js/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    name: 'NatureSoundMix',
    sourcemap: true
  },
  plugins: [
    resolve(),
    commonjs(),
    css({ output: 'style.css' }),
    !production && serve({
      contentBase: ['dist', 'public'],
      port: 3000,
      open: true
    }),
    !production && livereload('dist'),
    production && terser()
  ],
  watch: {
    clearScreen: false
  }
};
