import type { ResolvedCfg } from '@/types'

export const defCfg: ResolvedCfg = {
	manifest: 'package.json',
	bump: [],
	newVersion: '',
	commitMessage: 'chore(release): {{tag}}',
	tagPrefix: 'v',
	dryRun: false,
}