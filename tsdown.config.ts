import type { UserConfig } from 'tsdown'

const isProd = process.argv.includes('--prod')

export default [{
	entry: 'src/cli.ts',
	minify: isProd,
	sourcemap: isProd ? false : 'inline',
	fixedExtension: false,
}] satisfies UserConfig[]