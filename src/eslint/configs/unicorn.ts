import { loadPlugin } from '../utils.js';
import type { OverridesOptions, UnicornRules } from '../types/index.js';
import type { Linter } from 'eslint';

export const unicorn = async (options: OverridesOptions<UnicornRules> = {}): Promise<Linter.Config[]> => {
	const { rules: overrideRules = {} } = options;

	const unicorn = await loadPlugin<typeof import('eslint-plugin-unicorn').default>('eslint-plugin-unicorn');

	return [
		{
			name: 'sindresorhus/unicorn/recommended',
			plugins: {
				unicorn,
			},
			rules: {
				...unicorn.configs.recommended.rules,
			},
		},
		{
			name: 're-taro/unicorn/overrides',
			rules: {
				'unicorn/empty-brace-spaces': 'off',
				'unicorn/no-nested-ternary': 'off',
				'unicorn/number-literal-case': 'off',
				'unicorn/filename-case': 'off',
				'unicorn/no-array-callback-reference': 'off',
				'unicorn/no-array-reduce': 'off',
				'unicorn/no-negated-condition': 'off',
				'unicorn/prevent-abbreviations': 'off',

				...overrideRules,
			},
		},
	];
};
