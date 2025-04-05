import { switchExhaustivenessCheck } from './rules/index.js';
import type { TSESLint } from '@typescript-eslint/utils';

const plugin: TSESLint.FlatConfig.Plugin = {
	rules: {
		'switch-exhaustiveness-check': switchExhaustivenessCheck,
	},
};

export default plugin;
