import { defineConfig, type Plugin } from 'vitest/config'
import { resolve } from 'node:path'

const hbsRaw = (): Plugin => ({
	name: 'hbs-raw',
	enforce: 'pre',
	resolveId: source =>
		source.endsWith('.hbs') ? `${source}?raw` : null,
})

export default defineConfig({
	resolve: { alias: {	'@': resolve('src') } },
	plugins: [hbsRaw()],
})