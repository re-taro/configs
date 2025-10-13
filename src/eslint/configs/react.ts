import { GLOB_JSX, GLOB_TSX } from '../globs.js';
import { loadPlugin } from '../utils.js';
import type { OverridesOptions, ReactRules } from '../types/index.js';
import type { Linter } from 'eslint';

export const react = async (options: OverridesOptions<ReactRules> = {}): Promise<Linter.Config[]> => {
	const { rules: overrideRules = {} } = options;

	const [react, reactHooks, jsxA11y] = await Promise.all([
		loadPlugin<typeof import('eslint-plugin-react')>('eslint-plugin-react'),
		loadPlugin<typeof import('eslint-plugin-react-hooks')>('eslint-plugin-react-hooks'),
		loadPlugin<typeof import('eslint-plugin-jsx-a11y')>('eslint-plugin-jsx-a11y'),
	] as const);

	return [
		{
			name: 'jsx-eslint/react/recommended',
			files: [GLOB_JSX, GLOB_TSX],
			languageOptions: {
				...react.configs.flat['jsx-runtime']?.languageOptions,
			},
			plugins: {
				react,
				'react-hooks': reactHooks,
				'jsx-a11y': jsxA11y,
			},
			rules: {
				...react.configs.flat['recommended']?.rules,
				...react.configs.flat['jsx-runtime']?.rules,
				...jsxA11y.flatConfigs.strict.rules,
			},
		},
		{
			name: 're-taro/react/orverrides',
			files: [GLOB_JSX, GLOB_TSX],
			rules: {
				'react/jsx-handler-names': 'error',
				'react/jsx-no-constructed-context-values': 'error',
				'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
				'react/no-invalid-html-attribute': 'error',
				'react/no-object-type-as-default-prop': 'error',
				'react/no-unstable-nested-components': 'error',
				'react/prop-types': 'off',
				'react/no-unknown-property': 'off',
				'react-hooks/rules-of-hooks': 'error',
				'react-hooks/exhaustive-deps': 'error',
				'jsx-a11y/anchor-ambiguous-text': 'error',
				'jsx-a11y/control-has-associated-label': 'error',
				'jsx-a11y/lang': 'error',
				'jsx-a11y/no-aria-hidden-on-focusable': 'error',

				...overrideRules,
			},
		},
	];
};
