import { defineConfig } from '@/index'

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
			output: 'RELEASE.md',
			header: '',
			partials: {
				header: '',
			},
		},
	},
})