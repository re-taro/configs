import type {
	CssRules,
	ImportsRules,
	JavascriptRules,
	MarkdownRules,
	NodeRules,
	OverridesOptions,
	PromiseRules,
	ReactRules,
	RegexpRules,
	StorybookRules,
	TypescriptRules,
	UnicornRules,
	VitestRules,
} from './index.js';
import type { ImportsOptions, CssOptions, MarkdownOptions, TypeScriptOptions } from '../configs/index.js';

export interface OptionsConfig {
	/**
	 * CSS configuration
	 */
	css?: OverridesOptions<CssRules> & CssOptions;
	/**
	 * Imports configuration
	 */
	imports?: OverridesOptions<ImportsRules> & ImportsOptions;
	/**
	 * JavaScript configuration
	 */
	javascript?: OverridesOptions<JavascriptRules>;
	/**
	 * Markdown configuration
	 */
	markdown?: OverridesOptions<MarkdownRules> & MarkdownOptions;
	/**
	 * Node.js configuration
	 */
	node?: OverridesOptions<NodeRules>;
	/**
	 * Promise configuration
	 */
	promise?: OverridesOptions<PromiseRules>;
	/**
	 * React configuration
	 */
	react?: OverridesOptions<ReactRules>;
	/**
	 * Regular expression configuration
	 */
	regexp?: OverridesOptions<RegexpRules>;
	/**
	 * Storybook configuration
	 */
	storybook?: OverridesOptions<StorybookRules>;
	/**
	 * TypeScript configuration
	 */
	typescript?: OverridesOptions<TypescriptRules> & TypeScriptOptions;
	/**
	 * Unicorn configuration
	 */
	unicorn?: OverridesOptions<UnicornRules>;
	/**
	 * Vitest configuration
	 */
	vitest?: OverridesOptions<VitestRules>;
}
