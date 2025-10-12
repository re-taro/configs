import { GLOB_TESTS, GLOB_TESTS_TYPE } from '../globs.js';
import { loadPlugin } from '../utils.js';
import type { OverridesOptions, VitestRules } from '../types/index.js';
import type { Linter } from 'eslint';

export interface VitestOptions {
	/**
	 * Use type testing
	 *
	 * About type testing, see https://vitest.dev/guide/testing-types, and about eslint config, see
	 * https://github.com/vitest-dev/eslint-plugin-vitest?tab=readme-ov-file#enabling-with-type-testing
	 *
	 * @default false
	 */
	typeTesting?: boolean;
}

export const vitest = async (options: OverridesOptions<VitestRules> & VitestOptions = {}): Promise<Linter.Config[]> => {
	const { rules: overrideRules = {}, files: overrideFiles = [] } = options;
	const typeTesting = Boolean(options.typeTesting);

	const vitest = await loadPlugin<typeof import('@vitest/eslint-plugin').default>('@vitest/eslint-plugin');

	const configs: Linter.Config[] = [];

	const base: Linter.Config = {
		name: 'vitest/vitest/recommended',
		files: GLOB_TESTS,
		plugins: {
			// @ts-expect-error TS2322 Type '{ ... 73 mo...' is not assignable to type 'Plugin'.
			vitest,
		},
		rules: {
			...vitest.configs.recommended.rules,
		},
	};
	if (typeTesting) {
		base.files = [...base.files!, ...GLOB_TESTS_TYPE];
		base.settings = {
			vitest: {
				typecheck: true,
			},
		};

		base.languageOptions = {
			globals: {
				...vitest.environments.env.globals,
			},
		};
	}
	configs.push(base);

	const overrides: Linter.Config = {
		name: 're-taro/vitest/overrides',
		rules: {
			'node/no-unpublished-import': 'off',

			...overrideRules,
		},
	};
	if (overrideFiles.length > 0) {
		overrides.files = overrideFiles;
	}
	configs.push(overrides);

	return configs;
};
