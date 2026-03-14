import type { ResolvedCfg } from '@/types'

export const defCfg: ResolvedCfg = {
	manifest: 'package.json',
	bump: [],
	newVersion: '',
	contextFile: 'RELEASE.md',
	commitMessage: 'chore(release): {{tag}}',
	tagPrefix: 'v',
	dryRun: false,
}