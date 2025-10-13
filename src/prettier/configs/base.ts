import { req } from '../utils.js';
import type { Config } from '../types.js';

export const base = (): Config => {
	return {
		plugins: [req.resolve('@prettier/plugin-oxc')],
		printWidth: 120,
		tabWidth: 2,
		useTabs: true,
		semi: true,
		singleQuote: true,
		quoteProps: 'consistent',
		jsxSingleQuote: false,
		trailingComma: 'all',
		bracketSpacing: true,
		bracketSameLine: true,
		arrowParens: 'always',
		endOfLine: 'lf',
		experimentalTernaries: true,
		overrides: [
			{
				files: ['tsconfig.json'],
				options: {
					parser: 'jsonc',
				},
			},
		],
	};
};
