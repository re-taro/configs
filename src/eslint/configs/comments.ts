import type { Linter } from 'eslint';

export const comments = (): Linter.Config[] => {
	return [
		{
			name: 're-taro/comments',
			linterOptions: {
				reportUnusedDisableDirectives: 'error',
			},
		},
	];
};
