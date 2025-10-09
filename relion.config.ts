import { defineConfig } from '@/.'

export default defineConfig({
	_local: {
		bump: ['package.json'],
		changelog: { review: true },
		commit: { gpgSign: true },
		tag: { gpgSign: true },
	},
	_github: {
		logLevel: 'silent',
		context: {
			commitHyperlink: false,
			refHyperlink: false,
			footerChangelogUrl: true,
		},
		changelog: {
			output: 'stdout',
			commitRange: 'latest-release',
			header: '',
			partials: { header: '' },
		},
	},
})