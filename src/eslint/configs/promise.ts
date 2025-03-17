import { loadPlugin } from '../utils.js';
import type { OverridesOptions, PromiseRules } from '../types/index.js';
import type { Linter } from 'eslint';

export const promise = async (options: OverridesOptions<PromiseRules> = {}): Promise<Linter.Config[]> => {
	const { rules: overrideRules = {} } = options;

	// @ts-expect-error TS7016 Could not find a declaration file for module 'eslint-plugin-promise'.
	const promise = await loadPlugin<typeof import('eslint-plugin-promise')>('eslint-plugin-promise');

	return [
		{
			name: 'eslint-community/promise/recommended',
			plugins: {
				promise,
			},
			rules: {
				// eslint-disable-next-line ts/no-unsafe-member-access
				...promise.configs['flat/recommended'].rules,
			},
		},
		{
			name: 're-taro/promise/overrides',
			rules: {
				...overrideRules,
			},
		},
	];
};
