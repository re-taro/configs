import { base, ignores, jsdoc, json } from './configs/index.js';
import type { Config, OptionsConfig } from './types.js';
import { mergeConfig } from './utils.js';

export const re_taro = (options: OptionsConfig = {}, userConfig: Config = {}): Config => {
	const { ignoreFiles = [] } = options;

	const configs: Config[] = [];

	configs.push(base(), json(), jsdoc(), ignores({ ignoreFiles }));

	return mergeConfig(...configs, userConfig);
};
