import { GLOB_STORYBOOK, GLOB_STORYBOOK_CONFIG } from '../globs.js';
import { loadPlugin } from '../utils.js';
import type { OverridesOptions, StorybookRules } from '../types/index.js';
import type { Linter } from 'eslint';

export const storybook = async (options: OverridesOptions<StorybookRules> = {}): Promise<Linter.Config[]> => {
	const { rules: overrideRules = {} } = options;

	const [storybook, react, imports] = await Promise.all([
		loadPlugin<typeof import('eslint-plugin-storybook')>('eslint-plugin-storybook'),
		loadPlugin<typeof import('eslint-plugin-react')>('eslint-plugin-react'),
		loadPlugin<typeof import('eslint-plugin-import-x')>('eslint-plugin-import-x'),
	] as const);

	return [
		{
			name: 'storybook/storybook/recommended',
			files: [GLOB_STORYBOOK, GLOB_STORYBOOK_CONFIG],
			plugins: {
				// @ts-expect-error TS2322 Type '{ ...; })[]; };...' is not assignable to type 'Plugin'.
				storybook,
				react,
				// @ts-expect-error TS2322 Type '{ ...' is not assignable to type 'Plugin'.
				import: imports,
			},
			rules: {
				'react-hooks/rules-of-hooks': 'off',
				'import/no-anonymous-default-export': 'off',
				'storybook/await-interactions': 'error',
				'storybook/context-in-play-function': 'error',
				'storybook/default-exports': 'error',
				'storybook/hierarchy-separator': 'error',
				'storybook/no-redundant-story-name': 'error',
				'storybook/prefer-pascal-case': 'error',
				'storybook/story-exports': 'error',
				'storybook/use-storybook-expect': 'error',
				'storybook/use-storybook-testing-library': 'error',
				'storybook/csf-component': 'error',
				'storybook/no-stories-of': 'error',
				'storybook/no-title-property-in-meta': 'error',
				'storybook/no-uninstalled-addons': 'error',
			},
		},
		{
			name: 're-taro/storybook/overrides',
			files: [GLOB_STORYBOOK, GLOB_STORYBOOK_CONFIG],
			rules: {
				...overrideRules,
			},
		},
	];
};
