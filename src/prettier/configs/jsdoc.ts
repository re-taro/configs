import type { Config } from '../types.js';
import { req } from '../utils.js';

export const jsdoc = (): Config => {
	return {
		plugins: [req.resolve('prettier-plugin-jsdoc')],
		tsdoc: true,
		jsdocPreferCodeFences: true,
		jsdocCommentLineStrategy: 'multiline',
	};
};
