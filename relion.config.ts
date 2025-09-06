import { defineConfig } from './dist/index.js'

export default defineConfig({
	changelog: {},
	_github: {
		context: {
			commitHyperlink: false,
		},
		changelog: {
			outputFile: 'RELEASE.md',
			header: '',
			partials: {
				header: '',
			},
		},
	},
})