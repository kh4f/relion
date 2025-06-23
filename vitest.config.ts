import { defineConfig, type Plugin } from 'vitest/config'
import { resolve } from 'node:path'

const hbsRaw = (): Plugin => {
	return {
		name: 'hbs-raw',
		enforce: 'pre',
		transform(code: string, id: string) {
			if (id.endsWith('.hbs')) {
				return `export default ${JSON.stringify(code)}`
			}
		},
	}
}

export default defineConfig({
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
		},
	},
	plugins: [hbsRaw()],
})