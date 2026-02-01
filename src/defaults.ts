import type { Config, Bumper, Step } from '@/types'

export const STEP_ORDER: Step[] = ['context', 'bump', 'commit', 'tag']

export const defaultBumper: Bumper = {
	file: 'package.json',
	pattern: /(version.*?)\d[\w.+-]*/,
	replacement: '$1{{newVersion}}',
}

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