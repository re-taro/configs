import { GLOB_SRC } from '../globs.js';
import { loadPlugin } from '../utils.js';
import type { JavascriptRules, OverridesOptions } from '../types/index.js';
import type { Linter } from 'eslint';

export const javascript = async (options: OverridesOptions<JavascriptRules>): Promise<Linter.Config[]> => {
	const { rules: overrideRules = {} } = options;

	const [js, globals] = await Promise.all([
		loadPlugin<typeof import('@eslint/js')>('@eslint/js'),
		loadPlugin<typeof import('globals')>('globals'),
	] as const);

	return [
		{
			name: 'eslint/js/recommended',
			files: [GLOB_SRC],
			plugins: {
				js,
			},
			rules: {
				...js.configs.recommended.rules,
			},
		},
		{
			name: 're-taro/js/overrides',
			files: [GLOB_SRC],
			languageOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				globals: {
					...globals.browser,
					...globals.node,
					...globals.es2022,
				},
				parserOptions: {
					ecmaFeatures: {
						jax: true,
					},
					ecmaVersion: 'latest',
					sourceType: 'module',
				},
			},
			rules: {
				'array-callback-return': 'error',
				'no-constant-binary-expression': 'error',
				'no-constructor-return': 'error',
				'no-new-native-nonconstructor': 'error',
				'no-promise-executor-return': 'error',
				'no-self-compare': 'error',
				'no-unmodified-loop-condition': 'error',
				'no-constant-condition': ['error', { checkLoops: false }],
				'no-unreachable-loop': 'error',
				'no-unused-private-class-members': 'error',
				'require-atomic-updates': 'error',
				'complexity': ['error', 15],
				'default-case-last': 'error',
				'default-param-last': 'error',
				'eqeqeq': ['error', 'always', { null: 'ignore' }],
				'grouped-accessor-pairs': ['error', 'setBeforeGet'],
				'no-alert': 'error',
				'no-console': ['error', { allow: ['warn', 'error'] }],
				'no-else-return': 'error',
				'no-implicit-coercion': 'error',
				'no-lonely-if': 'error',
				'no-multi-assign': 'error',
				'no-multi-str': 'error',
				'no-new-func': 'error',
				'no-new-wrappers': 'error',
				'no-param-reassign': 'error',
				'no-plusplus': 'error',
				'no-throw-literal': 'error',
				'no-unneeded-ternary': 'error',
				'no-unused-expressions': 'error',
				'no-useless-constructor': 'error',
				'no-useless-return': 'error',
				'no-var': 'error',
				'object-shorthand': 'error',
				'operator-assignment': 'error',
				'prefer-arrow-callback': 'error',
				'prefer-const': 'error',
				'prefer-named-capture-group': 'error',
				'prefer-numeric-literals': 'error',
				'prefer-object-has-own': 'error',
				'prefer-object-spread': 'error',
				'prefer-promise-reject-errors': 'error',
				'prefer-regex-literals': 'error',
				'prefer-rest-params': 'error',
				'prefer-spread': 'error',
				'radix': 'error',
				'require-unicode-regexp': 'error',
				'symbol-description': 'error',
				...overrideRules,
			},
		},
	];
};
