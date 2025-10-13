import { GLOB_MD } from '../globs.js';
import { loadPlugin, renameRules } from '../utils.js';
import type { MarkdownRules, OverridesOptions } from '../types/index.js';
import type { Linter } from 'eslint';

export interface MarkdownOptions {
	/**
	 * Makrdown language
	 *
	 * @default 'gfm'
	 * @see https://github.com/eslint/markdown?tab=readme-ov-file#languages
	 */
	language?: 'commonmark' | 'gfm';
	/**
	 * Enable fenced code blocks
	 *
	 * @default true
	 * @see https://github.com/eslint/markdown/blob/main/docs/processors/markdown.md
	 */
	fencedCodeBlocks?: boolean;
}

export const markdown = async (
	options: OverridesOptions<MarkdownRules> & MarkdownOptions = {},
): Promise<Linter.Config[]> => {
	const { rules: overrideRules = {} } = options;
	const language = options.language ?? 'gfm';
	const fencedCodeBlocks = typeof options.fencedCodeBlocks === 'boolean' ? options.fencedCodeBlocks : true;

	const md = await loadPlugin<typeof import('@eslint/markdown').default>('@eslint/markdown');

	return [
		// @ts-expect-error TS2357 Type 'undefined' is not assignable to type 'LanguageOptions'.ts(2375)
		{
			name: 'eslint/markdown/recommended',
			files: [GLOB_MD],
			language: `md/${language}`,
			processor: fencedCodeBlocks ? 'md/markdown' : undefined,
			languageOptions:
				fencedCodeBlocks ?
					{
						parserOptions: {
							ecmaFeatures: {
								impliedStrict: true,
							},
						},
					}
				:	undefined,
			plugins: {
				md,
			},
			rules: {
				...renameRules(md.configs.recommended.at(0)?.rules!, { markdown: 'md' }),
				...(fencedCodeBlocks ? renameRules(md.configs.processor.at(-1)?.rules!, { markdown: 'md' }) : {}),
			},
		},
		{
			name: 're-taro/markdown/overrides',
			files: [GLOB_MD],
			rules: {
				...overrideRules,
			},
		},
	];
};
