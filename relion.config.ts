import { defineConfig } from './dist/index.js'

export default defineConfig({
	bump: [],
	changelog: {},
	commit: {
		gpgSign: true,
	},
	tag: {
		gpgSign: true,
	},
	_github: {
		context: {
			commitHyperlink: false,
		},
		changelog: {
			output: 'stdout',
			header: '',
			partials: {
				header: '',
			},
		},
	},
})