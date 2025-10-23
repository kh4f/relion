import { defineConfig, type UserConfig } from 'tsdown'

const isProd = process.argv.includes('--production')

const baseConfig: UserConfig = {
	sourcemap: isProd ? false : 'inline',
	minify: isProd,
}

export default defineConfig([
	{
		...baseConfig,
		entry: 'src/index.ts',
		loader: { '.hbs': 'text' },
	},
	{
		...baseConfig,
		entry: {
			cli: 'src/cli.ts',
			resolver: 'src/utils/import-resolver.ts',
		},
		dts: false,
		external: /.*/,
	},
])