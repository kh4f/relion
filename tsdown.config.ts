import { defineConfig, type UserConfig } from 'tsdown'

const isProd = process.argv.includes('--production')

const common: UserConfig = {
	outDir: './dist',
	sourcemap: isProd ? false : 'inline',
	minify: isProd,
}

export default defineConfig([
	{
		...common,
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
		...common,
		entry: './src/cli.ts',
		dts: false,
		outputOptions: {
			banner: `#!/usr/bin/env node\n`,
		},
	},
])