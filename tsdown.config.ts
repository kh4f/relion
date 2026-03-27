import type { UserConfig } from 'tsdown'

const prod = process.argv.includes('--prod')

export default [{
	entry: 'src/cli.ts',
	minify: prod,
	sourcemap: prod ? false : 'inline',
	fixedExtension: false,
}] satisfies UserConfig[]