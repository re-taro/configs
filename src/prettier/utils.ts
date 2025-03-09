import { createRequire } from 'node:module';
import type { Config } from './types.js';

export const req: NodeJS.Require = createRequire(import.meta.url);

export const mergeConfig = (...configs: Config[]): Config => {
	return configs.reduce<Config>((acc, config) => {
		return {
			...acc,
			...config,
			overrides: [...(acc.overrides ?? []), ...(config.overrides ?? [])],
			plugins: [...(acc.plugins ?? []), ...(config.plugins ?? [])],
		};
	}, {});
};
