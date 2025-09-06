import { defineConfig } from './dist/index.js'

export default defineConfig({
	bump: [],
	changelog: {},
	commit: {},
	tag: {},
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