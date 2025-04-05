import type { Awaitable } from './types/index.js';
import type { Linter } from 'eslint';

/**
 * Combine array and non-array configs into a single array.
 */
export const combine = async (...configs: Awaitable<Linter.Config | Linter.Config[]>[]): Promise<Linter.Config[]> => {
	const resolved = await Promise.all(configs);

	return resolved.flat();
};

/**
 * Resolve module with interop default
 */
export const interopDefault = async <T>(mod: Awaitable<T>): Promise<T extends { default: infer U } ? U : T> => {
	const resolved = await mod;

	// eslint-disable-next-line ts/no-unsafe-return, ts/no-unsafe-member-access
	return (resolved as any).default ?? resolved;
};

/**
 * Load eslint plugin
 */
export const loadPlugin = async <T = unknown>(name: string): Promise<T> => {
	const mod = await import(name).catch((error: unknown) => {
		console.error(error);
		throw new Error(`Failed to load eslint plugin '${name}'. Please install it!`);
	});

	return await (interopDefault(mod) as Promise<T>);
};

/**
 * Rename plugin prefixes in a rule object. Accepts a map of prefixes to rename.
 */

export const renameRules = (rules: Record<string, any>, map: Record<string, string>): Record<string, any> => {
	return Object.fromEntries(
		Object.entries(rules).map(([key, value]) => {
			for (const [from, to] of Object.entries(map)) {
				if (key.startsWith(`${from}/`)) return [to + key.slice(from.length), value];
			}
			return [key, value];
		}),
	);
};
