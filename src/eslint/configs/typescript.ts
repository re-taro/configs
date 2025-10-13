import { GLOB_DTS, GLOB_TS, GLOB_TSX } from '../globs.js';
import { loadPlugin, renameRules } from '../utils.js';
import type { OverridesOptions, TypescriptRules } from '../types/index.js';
import type { Linter } from 'eslint';

export interface TypeScriptOptions {
	/**
	 * Additional extensions for files.
	 *
	 * @see https://typescript-eslint.io/packages/parser/#extrafileextensions
	 */
	extraFileExtensions?: string[];
	/**
	 * Typescript-eslint parser options
	 */
	parserOptions?: TypeScriptParserOptions;
}

/**
 * @see https://typescript-eslint.io/getting-started/typed-linting
 */
export interface TypeScriptParserOptions {
	/**
	 * @default true
	 * @see https://typescript-eslint.io/packages/parser/#projectservice
	 */
	projectService?: boolean;
	/**
	 * @see https://typescript-eslint.io/packages/parser#tsconfigrootdir
	 */
	tsconfigRootDir?: string;
}

export const typescript = async (
	options: OverridesOptions<TypescriptRules> & TypeScriptOptions = {},
): Promise<Linter.Config[]> => {
	const { rules: overrideRules = {}, extraFileExtensions = [], parserOptions = { projectService: true } } = options;
	const files = options.files ?? [GLOB_TS, GLOB_TSX, ...extraFileExtensions.map((ext) => `**/*${ext}`)];

	const [ts, re_taro] = await Promise.all([
		loadPlugin<typeof import('typescript-eslint').default>('typescript-eslint'),
		loadPlugin<typeof import('../plugins/index.js').default>('./plugins/index.js'),
	]);

	return [
		{
			name: 'typescript-eslint/typescript/recommended',
			files,
			languageOptions: {
				parser: ts.parser,
				parserOptions: {
					extraFileExtensions: extraFileExtensions.map((ext) => ext),
					sourceType: 'module',
					...parserOptions,
				},
			},
			plugins: {
				'ts': ts.plugin,
				// @ts-expect-error TS2375 Type 'ESLint.Plugin' with 'exactOptionalPropertyTypes: true'. Consider adding 'undefined' to the types of the target's properties.
				're-taro': re_taro,
			},
			rules: {
				...renameRules(ts.configs.strictTypeChecked.at(-1)?.rules!, {
					'@typescript-eslint': 'ts',
				}),
				...renameRules(ts.configs.stylisticTypeChecked.at(-1)?.rules!, {
					'@typescript-eslint': 'ts',
				}),
				...renameRules(ts.configs.eslintRecommended.rules!, {
					'@typescript-eslint': 'ts',
				}),
			},
		},
		{
			name: 're-taro/typescript/overrides',
			files,
			rules: {
				'ts/explicit-module-boundary-types': 'error',
				'ts/consistent-type-exports': [
					'error',
					{
						fixMixedExportsWithInlineTypeSpecifier: true,
					},
				],
				'ts/consistent-type-imports': [
					'error',
					{
						prefer: 'type-imports',
						fixStyle: 'separate-type-imports',
					},
				],
				'ts/no-unused-vars': [
					'error',
					{
						argsIgnorePattern: '^_',
					},
				],
				'ts/no-import-type-side-effects': 'error',
				'ts/prefer-readonly': 'error',
				'ts/promise-function-async': 'error',
				'ts/require-array-sort-compare': 'error',
				'ts/return-await': ['error', 'always'],
				'ts/no-unnecessary-condition': ['error', { allowConstantLoopConditions: true }],
				're-taro/switch-exhaustiveness-check': 'error',

				...overrideRules,
			},
		},
		{
			name: 're-taro/typescript/dts',
			files: [GLOB_DTS],
			rules: {
				'import/no-duplicates': 'off',
				'ts/triple-slash-reference': 'off',
			},
		},
	];
};
