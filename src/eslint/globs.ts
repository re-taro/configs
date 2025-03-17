export const GLOB_SRC_EXT = '?([cm])[jt]s?(x)';
export const GLOB_SRC: `**/*.${typeof GLOB_SRC_EXT}` = `**/*.${GLOB_SRC_EXT}`;
export const GLOB_JS_EXT = '?([cm])js';
export const GLOB_JS: `**/*.${typeof GLOB_JS_EXT}` = `**/*.${GLOB_JS_EXT}`;
export const GLOB_JSX_EXT = '?([cm])jsx';
export const GLOB_JSX: `**/*.${typeof GLOB_JSX_EXT}` = `**/*.${GLOB_JSX_EXT}`;
export const GLOB_TS_EXT = '?([cm])ts';
export const GLOB_TS: `**/*.${typeof GLOB_TS_EXT}` = `**/*.${GLOB_TS_EXT}`;
export const GLOB_TSX_EXT = '?([cm])tsx';
export const GLOB_TSX: `**/*.${typeof GLOB_TSX_EXT}` = `**/*.${GLOB_TSX_EXT}`;
export const GLOB_DTS_EXT = '?([cm])d.ts';
export const GLOB_DTS: `**/*.${typeof GLOB_DTS_EXT}` = `**/*.${GLOB_DTS_EXT}`;
export const GLOB_STORYBOOK_EXT: `@(stories|story).${typeof GLOB_TSX_EXT}` = `@(stories|story).${GLOB_TSX_EXT}`;
export const GLOB_STORYBOOK: `**/*.${typeof GLOB_STORYBOOK_EXT}` = `**/*.${GLOB_STORYBOOK_EXT}`;
export const GLOB_STORYBOOK_CONFIG: `**/.storybook/main.${typeof GLOB_SRC_EXT}` = `**/.storybook/main.${GLOB_SRC_EXT}`;
export const GLOB_MD = '**/*.md';
export const GLOB_CSS = '**/*.css';
export const GLOB_TESTS: [
	`**/test/**/*.${typeof GLOB_SRC_EXT}`,
	`**/tests/**/*.${typeof GLOB_SRC_EXT}`,
	`**/spec/**/*.${typeof GLOB_SRC_EXT}`,
	`**/specs/**/*.${typeof GLOB_SRC_EXT}`,
	`**/e2e/**/*.${typeof GLOB_SRC_EXT}`,
	`**/__tests__/**/*.${typeof GLOB_SRC_EXT}`,
	`**/__test__/**/*.${typeof GLOB_SRC_EXT}`,
	`**/*.spec.${typeof GLOB_SRC_EXT}`,
	`**/*.test.${typeof GLOB_SRC_EXT}`,
] = [
	`**/test/**/*.${GLOB_SRC_EXT}`,
	`**/tests/**/*.${GLOB_SRC_EXT}`,
	`**/spec/**/*.${GLOB_SRC_EXT}`,
	`**/specs/**/*.${GLOB_SRC_EXT}`,
	`**/e2e/**/*.${GLOB_SRC_EXT}`,
	`**/__tests__/**/*.${GLOB_SRC_EXT}`,
	`**/__test__/**/*.${GLOB_SRC_EXT}`,
	`**/*.spec.${GLOB_SRC_EXT}`,
	`**/*.test.${GLOB_SRC_EXT}`,
] as const;
export const GLOB_TESTS_TYPE: [`**/*.test-d.${typeof GLOB_SRC_EXT}`, `**/*.spec-d.${typeof GLOB_SRC_EXT}`] = [
	`**/*.test-d.${GLOB_SRC_EXT}`,
	`**/*.spec-d.${GLOB_SRC_EXT}`,
] as const;
