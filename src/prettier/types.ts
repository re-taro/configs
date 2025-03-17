import type { Options as BaseOptions } from 'prettier';
import type { Options as JsdocOptions } from 'prettier-plugin-jsdoc';

export interface Options extends BaseOptions, JsdocOptions {}

export interface Config extends Options {
	overrides?: {
		files: string | string[];
		excludeFiles?: string | string[];
		options?: Options;
	}[];
}

export interface OptionsConfig {
	/**
	 * Ignore files.
	 */
	ignoreFiles?: string[];
}
