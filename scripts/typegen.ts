import fs from 'node:fs/promises';
import path from 'node:path';
import { flatConfigsToRulesDTS } from 'eslint-typegen/core';
import { interopDefault } from '../src/eslint/utils.js';
import type { Linter } from 'eslint';

type PresetModule = Record<string, (...parameters: unknown[]) => Promise<Linter.Config[]>>;

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const pascalize = (value: string): string => {
	// eslint-disable-next-line ts/restrict-template-expressions
	return value.replaceAll(/\w+/gu, (w) => `${w[0]?.toUpperCase()}${w.slice(1).toLowerCase()}`);
};

const loadPresets = async () => {
	const files = await fs.readdir(path.resolve(__dirname, '../src/eslint/configs'));

	return files.filter((file) => file.endsWith('.ts') && file !== 'index.ts').map((file) => file.replace(/\.ts$/u, ''));
};

const css = (): PresetModule => {
	return {
		css: async (): Promise<Linter.Config[]> => {
			const { rules } = await interopDefault(await import('@eslint/css'));
			const configs = {
				plugins: {
					css: {
						rules,
					},
				},
			};

			return [configs];
		},
	};
};

const javascript = (): PresetModule => {
	return {
		javascript: async (): Promise<Linter.Config[]> => {
			// eslint-disable-next-line ts/no-deprecated
			const { builtinRules } = await interopDefault(await import('eslint/use-at-your-own-risk'));
			const configs = {
				plugins: {
					'': {
						rules: Object.fromEntries(builtinRules.entries()),
					},
				},
			};
			return [configs];
		},
	};
};

const markdown = (): PresetModule => {
	return {
		markdown: async (): Promise<Linter.Config[]> => {
			const { rules } = await interopDefault(await import('@eslint/markdown'));
			const configs = {
				plugins: {
					markdown: {
						rules,
					},
				},
			};
			return [configs];
		},
	};
};

const resolvePresetModule = async (preset: string): Promise<PresetModule> => {
	switch (preset) {
		case 'css': {
			return css();
		}
		case 'javascript': {
			return javascript();
		}
		case 'markdown': {
			return markdown();
		}
		default: {
			// eslint-disable-next-line ts/no-unsafe-return
			return await import(path.resolve(__dirname, `../src/eslint/configs/${preset}`));
		}
	}
};

const main = async () => {
	const presets = await loadPresets();
	const parameters = {};

	for (const preset of presets) {
		// eslint-disable-next-line no-console
		console.log(`Generating types for ${preset} ...`);

		const module_ = await resolvePresetModule(preset);
		// eslint-disable-next-line unicorn/no-await-expression-member
		const resolvedModule = (await interopDefault(module_))[preset]!;
		const configs = await resolvedModule(parameters);

		let dts = await flatConfigsToRulesDTS(configs, {
			includeTypeImports: preset !== 'prettier',
			includeAugmentation: false,
			exportTypeName: `${pascalize(preset)}Rules`,
		});
		// NOTE: workaround for vitest type gen errors with eslint-typegen
		if (preset === 'vitest') {
			dts = `// @ts-nocheck\n` + dts;
		}
		await fs.writeFile(path.resolve(__dirname, `../src/eslint/types/gens/${preset}.ts`), dts);
	}

	const eslintDts = [
		...presets.map((p) => `import type { ${pascalize(p)}Rules } from './${p}.js'`),
		``,
		`declare module 'eslint' {`,
		`  namespace Linter {`,
		`    interface RulesRecord extends ${presets.map((p) => `${pascalize(p)}Rules`).join(', ')} {}`,
		`  }`,
		`}`,
	];
	await fs.writeFile(path.resolve(__dirname, `../src/eslint/types/gens/eslint.ts`), eslintDts.join('\n'));
};

// eslint-disable-next-line unicorn/prefer-top-level-await
main().catch((error: unknown) => {
	console.error(error);

	// eslint-disable-next-line node/no-process-exit, unicorn/no-process-exit
	process.exit(1);
});
