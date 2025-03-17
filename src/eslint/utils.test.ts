import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { loadPlugin } from './utils.js';

describe('loadPlugin', () => {
	beforeEach(() => {
		// suppress console.error
		// eslint-disable-next-line ts/no-empty-function
		vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	test('success', async () => {
		const plugin = await loadPlugin('eslint-config-flat-gitignore');
		expect(plugin).toBeDefined();
	});

	test('failure', async () => {
		await expect(loadPlugin('foo')).rejects.toThrow(/Failed to load eslint plugin 'foo'. Please install it!/u);
	});
});
