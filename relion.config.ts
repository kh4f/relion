import { defineConfig } from './dist/index.js'

export default defineConfig({
	commit: {
		gpgSign: true,
	},
	tag: {
		gpgSign: true,
	},
	_github: {
		bump: false,
		commit: false,
		tag: false,
		silent: true,
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