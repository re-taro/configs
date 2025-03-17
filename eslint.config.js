// @ts-check

import { re_taro } from '@re-taro/configs/eslint';

export default re_taro({
	imports: {
		rules: {
			'import/no-useless-path-segments': 'off',
		},
	},
	typescript: {
		rules: {
			'ts/consistent-type-imports': 'off',
			'ts/no-non-null-assertion': 'off',
			'ts/no-non-null-asserted-optional-chain': 'off',
			'ts/no-explicit-any': 'off',
			'ts/no-unsafe-assignment': 'off',
		},
	},
});
