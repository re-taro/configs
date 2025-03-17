import { GLOB_CSS } from '../globs.js';
import { loadPlugin } from '../utils.js';
import type { CssRules, OverridesOptions } from '../types/index.js';
import type { Linter } from 'eslint';

export interface CssOptions {
	/**
	 * Whether to enable strict mode
	 *
	 * @default false
	 * @see https://github.com/eslint/css?tab=readme-ov-file#tolerant-mode
	 */
	tolerant?: boolean;
	/**
	 * Whether to enable custom syntax
	 *
	 * If 'tailwind', it will enable [Tailwind
	 * Syntax](https://github.com/eslint/css?tab=readme-ov-file#configuring-tailwind-syntax), otherwise it will enable
	 * [custom syntax](https://github.com/eslint/css?tab=readme-ov-file#configuring-custom-syntax)
	 *
	 * @default false
	 */
	// TODO: If this issue is resolved, we should define more strict types for customSyntax
	// https://github.com/eslint/css/issues/56
	customSyntax?: false | 'tailwind' | Record<string, any>;
}

export const css = async (options: OverridesOptions<CssRules> & CssOptions = {}): Promise<Linter.Config[]> => {
	const { rules: overrideRules = {}, tolerant = false, customSyntax = false } = options;

	const css = await loadPlugin<typeof import('@eslint/css').default>('@eslint/css');

	const core: Linter.Config = {
		name: 'eslint/css/recommended',
		files: [GLOB_CSS],
		language: 'css/css',
		plugins: {
			css,
		},
		rules: {
			...css.configs.recommended.rules,
		},
	};
	if (tolerant) {
		core.languageOptions = {
			tolerant,
		};
	}
	if (customSyntax) {
		// eslint-disable-next-line ts/no-unnecessary-condition
		if (typeof customSyntax === 'string' && customSyntax === 'tailwind') {
			const { tailwindSyntax } = await loadPlugin<typeof import('@eslint/css/syntax')>('@eslint/css/syntax');

			core.languageOptions = {
				customSyntax: tailwindSyntax,
			};
		} else {
			core.languageOptions = {
				customSyntax,
			};
		}
	}

	return [
		core,
		{
			name: 're-taro/css/overrides',
			files: [GLOB_CSS],
			rules: {
				...overrideRules,
			},
		},
	];
};
