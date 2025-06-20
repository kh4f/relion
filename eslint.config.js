import { defineConfig, globalIgnores } from 'eslint/config'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'
import globals from 'globals'

const isExtensionMode = !!process.env.VSCODE_CWD

export default defineConfig([
	globalIgnores([
		'dist',
		// Lint `temp` directory only in extension mode
		(!isExtensionMode ? 'temp' : ''),
	].filter(Boolean), 'Global Ignores'),
	{
		name: 'Base Rules',
		files: ['**/*.{js,ts}'],
		extends: [
			eslint.configs.recommended,
		],
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
	},
	{
		name: 'Type-Aware Rules',
		files: ['**/*.ts'],
		extends: [
			// @ts-expect-error TS2322: type mismatch between ESLint and typescript-eslint
			// see https://github.com/eslint/eslint/issues/19570#issuecomment-2749093867
			tseslint.configs.recommendedTypeChecked,
			// @ts-expect-error TS2322: type mismatch between ESLint and typescript-eslint
			tseslint.configs.stylisticTypeChecked,
		],
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	{
		name: 'Stylistic Rules',
		files: ['**/*.{js,ts}'],
		plugins: {
			'@stylistic': stylistic,
		},
		extends: [
			stylistic.configs.recommended,
		],
		rules: {
			'@stylistic/indent': ['error', 'tab'],
			'@stylistic/no-tabs': 'off',
			'@stylistic/linebreak-style': ['error', 'unix'],
			'@stylistic/eol-last': ['error', 'never'],
		},
	},
])