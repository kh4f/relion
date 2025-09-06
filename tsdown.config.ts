import { defineConfig, type UserConfig } from 'tsdown'

const isProd = process.argv.includes('--production')

const baseConfig: UserConfig = {
	sourcemap: isProd ? false : 'inline',
	minify: isProd,
}

export default defineConfig([
	{
		...baseConfig,
		entry: {
			index: './src/index.ts',
			preset: './src/preset/index.ts',
		},
		dts: true,
		loader: {
			'.hbs': 'text',
		},
	},
	{
		...baseConfig,
		entry: './src/cli.ts',
		dts: false,
		outputOptions: {
			banner: `#!/usr/bin/env node\n`,
		},
	},
])