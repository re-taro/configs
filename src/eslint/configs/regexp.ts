import { loadPlugin } from '../utils.js';
import type { OverridesOptions, RegexpRules } from '../types/index.js';
import type { Linter } from 'eslint';

export const regexp = async (options: OverridesOptions<RegexpRules> = {}): Promise<Linter.Config[]> => {
	const { rules: overrideRules = {} } = options;

	const regexp = await loadPlugin<typeof import('eslint-plugin-regexp')>('eslint-plugin-regexp');

	return [
		{
			name: 'ota-meshi/regexp/recommended',
			plugins: {
				regexp,
			},
			rules: {
				...regexp.configs['flat/recommended'].rules,
			},
		},
		{
			name: 're-taro/regexp/overrides',
			rules: {
				...overrideRules,
			},
		},
	];
};
