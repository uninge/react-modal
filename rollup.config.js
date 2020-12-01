import stylelint from 'rollup-plugin-stylelint';
import { eslint } from "rollup-plugin-eslint";
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import svgr from '@svgr/rollup';
import typescript from 'rollup-plugin-typescript2';

import pkg from './package.json';

const globals = {
	react: 'React',
	'react-dom': 'ReactDom',
	'prop-types': 'PropTypes',
};

export default {
  input: 'src/index.ts',
  external: Object.keys(globals),
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: 'ReactModal',
			sourcemap: true,
			globals,
		},
  ],
  plugins: [
		stylelint({
			throwOnError: true,
			include: ['**/*.less'],
		}),
		eslint({
			useEslintrc: true,
			include: ['**/*.{ts,tsx}'],
		}),
		postcss({
			extract: `index.css`,
			plugins: [require('autoprefixer')],
		}),
		external(),
    svgr(),
		typescript({
			clean: true,
		}),
  ],
};
