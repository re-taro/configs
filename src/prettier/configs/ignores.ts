import type { Config, OptionsIgnores } from '../types.js';

const DEFAULT_IGNORES = ['**/package-lock.json', '**/pnpm-lock.yaml', '**/.yarn/**'];

export const ignores = (options: OptionsIgnores = {}): Config => {
	const { ignoreFiles = [] } = options;

	return {
		overrides: [
			// https://github.com/prettier/prettier/issues/4708#issuecomment-1448705672
			{
				files: [...DEFAULT_IGNORES, ...ignoreFiles],
				options: {
					requirePragma: true,
				},
			},
		],
	};
};
