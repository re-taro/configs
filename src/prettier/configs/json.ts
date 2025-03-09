import type { Config } from '../types.js';
import { req } from '../utils.js';

export const json = (): Config => {
	return {
		overrides: [
			{
				files: ['package.json'],
				options: {
					plugins: [req.resolve('prettier-plugin-pkg')],
					trailingComma: 'none',
				},
			},
			{
				excludeFiles: ['package.json'],
				files: ['*.json'],
				options: {
					jsonRecursiveSort: true,
					plugins: [req.resolve('prettier-plugin-sort-json')],
					trailingComma: 'none',
				},
			},
		],
	};
};
