import { defineConfig } from '@/.'

export default defineConfig({
	bump: ['package.json'],
	changelog: true,
	commit: { gpgSign: true },
	tag: { gpgSign: true },
	_github: {
		bump: false,
		commit: false,
		tag: false,
		logLevel: 'silent',
		context: {
			commitHyperlink: false,
			refHyperlink: false,
			footerChangelogUrl: true,
		},
		changelog: {
			output: 'stdout',
			header: '',
			partials: { header: '' },
		},
	},
})