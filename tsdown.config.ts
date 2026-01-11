import { defineConfig, type UserConfig } from 'tsdown'

const isProd = process.argv.includes('--prod')

const baseConfig: UserConfig = {
	minify: isProd,
	sourcemap: isProd ? false : 'inline',
	fixedExtension: false,
}

export default defineConfig([
	{ ...baseConfig, entry: 'src/index.ts' },
	{ ...baseConfig, entry: 'src/cli.ts', external: /index/, dts: false },
])