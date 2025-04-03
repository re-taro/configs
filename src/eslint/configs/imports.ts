import { GLOB_JS, GLOB_JSX, GLOB_SRC, GLOB_TS, GLOB_TSX } from '../globs.js';
import { loadPlugin, renameRules } from '../utils.js';
import type { ImportsRules, OverridesOptions } from '../types/index.js';
import type { Linter } from 'eslint';

const IMPORTS_FILES = [GLOB_JS, GLOB_JSX, GLOB_TS, GLOB_TSX];

/**
 * Imports configuration options
 */
export interface ImportsOptions {
	/**
	 * Use typescript
	 *
	 * @default false
	 */
	typescript?: boolean;
}

export const imports = async (
	options: OverridesOptions<ImportsRules> & ImportsOptions = {},
): Promise<Linter.Config[]> => {
	const { rules: overrideRules = {} } = options;

	const [unused, imports] = await Promise.all([
		loadPlugin<typeof import('eslint-plugin-unused-imports').default>('eslint-plugin-unused-imports'),
		loadPlugin<typeof import('eslint-plugin-import-x')>('eslint-plugin-import-x'),
	] as const);

	const configs: Linter.Config[] = [
		{
			name: 'un-ts/import/recommended',
			files: [GLOB_SRC],
			plugins: {
				// @ts-expect-error TS2322 Type '{ ...' is not assignable to type 'Plugin'.
				import: imports,
			},
			// @ts-expect-error TS2322 Type '{ ...' is not assignable to type 'LanguageOptions'.
			languageOptions: {
				...imports.flatConfigs.recommended.languageOptions,
			},
			rules: {
				// @ts-expect-error TS2345 Argument of type '(Record<`import-x/${string}`, RuleEntry> & Partial<Record<string, RuleEntry>>) | undefined' is not assignable to parameter of type 'Record<string, any>'.
				...renameRules(imports.flatConfigs.recommended.rules, {
					'import-x': 'import',
				}),
			},
		},
	];

	if (options.typescript) {
		try {
			await loadPlugin<typeof import('eslint-import-resolver-typescript')>('eslint-import-resolver-typescript');

			configs.push({
				name: 'un-ts/import/typescript',
				plugins: {
					// @ts-expect-error TS2322 Type '{ ...' is not assignable to type 'Plugin'.
					import: imports,
				},
				settings: {
					...imports.flatConfigs.typescript.settings,
				},
				rules: {
					...renameRules(imports.flatConfigs.typescript.rules, {
						'import-x': 'import',
					}),
				},
			});
		} catch (error) {
			const error_ =
				error instanceof Error ?
					new Error(`Not found eslint-import-resolver-typescript: ${error.message}`)
				:	new TypeError(`Not found eslint-import-resolver-typescript`);
			throw error_;
		}
	}

	configs.push(
		{
			name: 're-taro/unused-imports',
			files: IMPORTS_FILES,
			plugins: {
				unused,
			},
			rules: {
				'no-unused-vars': 'off',
				'ts/no-unused-vars': 'off',
				'unused/no-unused-imports': 'error',
				'unused/no-unused-vars': [
					'error',
					{
						args: 'all',
						argsIgnorePattern: '^_',
						caughtErrors: 'all',
						caughtErrorsIgnorePattern: '^_',
						destructuredArrayIgnorePattern: '^_',
						vars: 'all',
						varsIgnorePattern: '^_',
						ignoreRestSiblings: true,
					},
				],
			},
		},
		{
			name: 're-taro/imports/overrides',
			files: IMPORTS_FILES,
			rules: {
				'import/namespace': 'off',
				'import/no-unresolved': 'off',
				'import/named': 'off',
				'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
				'import/first': 'error',
				'import/no-duplicates': 'error',
				'import/no-named-default': 'error',
				'import/no-useless-path-segments': ['error', { noUselessIndex: true }],
				'import/no-self-import': 'error',
				'import/order': [
					'error',
					{
						'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'type'],
						'newlines-between': 'never',
						'alphabetize': {
							order: 'asc',
							caseInsensitive: true,
						},
						'warnOnUnassignedImports': true,
					},
				],

				...overrideRules,
			},
		},
	);

	return configs;
};
