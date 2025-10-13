import {
	comments,
	css,
	imports,
	javascript,
	markdown,
	node,
	promise,
	react,
	regexp,
	storybook,
	typescript,
	unicorn,
	vitest,
} from './configs/index.js';
import { loadPlugin } from './utils.js';
import type { Awaitable, OptionsConfig } from './types/index.js';
import type { Linter } from 'eslint';
import type { FlatConfigComposer } from 'eslint-flat-config-utils';

export const re_taro = async (
	options: OptionsConfig = {},
	...configs: Awaitable<Linter.Config | Linter.Config[]>[]
): Promise<FlatConfigComposer> => {
	const { FlatConfigComposer } =
		await loadPlugin<typeof import('eslint-flat-config-utils')>('eslint-flat-config-utils');

	const {
		css: cssOptions = {},
		imports: importsOptions = {},
		javascript: javascriptOptions = {},
		markdown: markdownOptions = {},
		node: nodeOptions = {},
		promise: promiseOptions = {},
		react: reactOptions = {},
		regexp: regexpOptions = {},
		storybook: storybookOptions = {},
		typescript: typescriptOptions = {},
		unicorn: unicornOptions = {},
		vitest: vitestOptions = {},
	} = options;
	const baseConfigs: Awaitable<Linter.Config[]>[] = [];

	baseConfigs.push(
		comments(),
		css(cssOptions).then((c) => c),
		imports(importsOptions).then((c) => c),
		javascript(javascriptOptions).then((c) => c),
		markdown(markdownOptions).then((c) => c),
		node(nodeOptions).then((c) => c),
		promise(promiseOptions).then((c) => c),
		react(reactOptions).then((c) => c),
		regexp(regexpOptions).then((c) => c),
		storybook(storybookOptions).then((c) => c),
		typescript(typescriptOptions).then((c) => c),
		unicorn(unicornOptions).then((c) => c),
		vitest(vitestOptions).then((c) => c),
		loadPlugin<typeof import('eslint-config-flat-gitignore').default>('eslint-config-flat-gitignore').then((c) => [
			c(),
		]),
	);

	const finalConfigs = [
		loadPlugin<typeof import('eslint-config-prettier/flat')>('eslint-config-prettier/flat').then((c) => c),
	];

	return await new FlatConfigComposer().append(...baseConfigs, ...configs).append(...finalConfigs);
};
