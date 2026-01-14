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
	commitFilters: [/^feat|^fix|^perf|^style|^docs/, 'BREAKING CHANGE'],
	dryRun: false,
}