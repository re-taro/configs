import { loadPlugin, renameRules } from '../utils.js';
import type { NodeRules, OverridesOptions } from '../types/index.js';
import type { Linter } from 'eslint';

export const node = async (options: OverridesOptions<NodeRules> = {}): Promise<Linter.Config[]> => {
	const { rules: overrideRules = {} } = options;

	const node = await loadPlugin<typeof import('eslint-plugin-n')>('eslint-plugin-n');

	return [
		{
			name: 'eslint-community/node/recommended',
			languageOptions: {
				...node.configs['flat/recommended'].languageOptions,
			},
			plugins: {
				node,
			},
			rules: {
				// @ts-expect-error TS2345 Argument of type 'Partial<RulesRecord> | undefined' is not assignable to parameter of type 'Record<string, any>'.
				...renameRules(node.configs['flat/recommended'].rules, { n: 'node' }),
			},
		},
		{
			name: 're-taro/node/overrides',
			rules: {
				'node/no-deprecated-api': 'error',
				'node/no-exports-assign': 'error',
				'node/no-path-concat': 'error',
				'node/no-process-exit': 'error',
				'node/no-unpublished-bin': 'error',
				'node/no-sync': 'error',
				'node/process-exit-as-throw': 'error',
				'node/prefer-global/console': 'error',
				'node/prefer-global/text-decoder': 'error',
				'node/prefer-global/text-encoder': 'error',
				'node/prefer-global/url': 'error',
				'node/prefer-global/url-search-params': 'error',
				'node/prefer-promises/dns': 'error',
				'node/prefer-promises/fs': 'error',

				...overrideRules,
			},
		},
	];
};
