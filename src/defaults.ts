import type { ResolvedCfg } from '@/types'

export const defCfg: ResolvedCfg = {
	bump: ['package.json'],
	newVersion: '',
	commitMessage: 'chore(release): {{tag}}',
	tagPrefix: 'v',
	dryRun: false,
}