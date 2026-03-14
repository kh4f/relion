import type { ResolvedCfg } from '@/types'

export const COMMIT_TEMPLATE = 'chore(release): {{tag}}'

export const defCfg: ResolvedCfg = {
	bump: ['package.json'],
	newVersion: '',
	tagPrefix: 'v',
	dryRun: false,
}