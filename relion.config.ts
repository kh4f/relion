import { defineConfig } from '@/.'

export default defineConfig({
	_default: {
		lifecycle: 'all',
		bump: ['package.json'],
		changelog: { review: true },
		commit: { gpgSign: true },
		tag: { gpgSign: true },
	},
	_github: {
		lifecycle: ['changelog'],
		logLevel: 'silent',
		context: { commitRefLinks: false, footerChangelogUrl: true },
		changelog: {
			output: 'stdout',
			commitRange: 'latest-release',
			header: '',
			partials: { header: '' },
		},
	},
})