import stylelint from 'rollup-plugin-stylelint';
import { eslint } from "rollup-plugin-eslint";
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import svgr from '@svgr/rollup';
import babel from '@rollup/plugin-babel';
import typescript from 'rollup-plugin-typescript2';
// import commonjs from "@rollup/plugin-commonjs";

import pkg from './package.json';

const globals = {
	react: 'React',
	'react-dom': 'ReactDom',
	'prop-types': 'PropTypes',
};

export default {
  input: 'src/index.js',
  external: Object.keys(globals),
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: 'ReactModal',
			sourcemap: true,
			banner: '/* eslint-disable */',
			globals,
		},
  ],
  plugins: [
		stylelint({
			throwOnError: true,
		}),
		eslint({
			useEslintrc: true,
			include: ['**/*.js'],
		}),
		postcss({
			extract: `index.css`,
		}),
		external(),
    svgr(),
    babel({
			babelHelpers: 'bundled',
			extensions: ['js']
    }),
		typescript(),
		// commonjs(),
  ],
};
