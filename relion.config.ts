import { defineConfig } from '@/.'

export default defineConfig({
	bump: true,
	changelog: true,
	commit: { gpgSign: true },
	tag: { gpgSign: true },
	_github: {
		bump: false,
		commit: false,
		tag: false,
		logLevel: 'silent',
		context: { commitHyperlink: false },
		changelog: {
			output: 'stdout',
			header: '',
			partials: { header: '' },
		},
	},
})