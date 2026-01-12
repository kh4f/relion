import type { Config, Bumper } from '@/types'

export const defaultBumpers: Bumper[] = [
	{
		file: 'package.json',
		pattern: /("version": )".*"/,
		replacement: '$1"{{newVersion}}"',
	},
]

export const defaultCfg: Required<Config> = {
	flow: [],
	newVersion: '',
	bumpFiles: ['package.json'],
	contextFile: 'RELEASE.md',
	commitMessage: 'chore(release): {{tag}}',
	tagPrefix: 'v',
	commitFilters: [
		c => /^feat|^fix|^perf|^style|^docs/.test(c.message),
		c => c.message.includes('BREAKING CHANGE'),
	],
	dryRun: false,
}