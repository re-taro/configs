import type { Options as BaseOptions } from 'prettier';
import type { Options as JsdocOptions } from 'prettier-plugin-jsdoc';
import type { PluginOptions as TailwindcssOptions } from 'prettier-plugin-tailwindcss';

export interface Options extends BaseOptions, JsdocOptions, TailwindcssOptions {}

export interface Config extends Options {
	overrides?: {
		files: string | string[];
		excludeFiles?: string | string[];
		options?: Options;
	}[];
}

export interface OptionsConfig {
	/**
	 * Enable Tailwind CSS support.
	 *
	 * @default auto-detect based on the dependencies
	 */
	tailwindcss?: boolean;

	/**
	 * Enable Astro support.
	 *
	 * @default auto-detect based on the dependencies
	 */
	astro?: boolean;

	/**
	 * Ignore files.
	 */
	ignoreFiles?: string[];
}

export interface OptionsIgnores {
	/**
	 * Ignore files.
	 */
	ignoreFiles?: string[];
}
