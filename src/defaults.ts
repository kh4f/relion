import type { Step, ResolvedCfg } from '@/types'

export const STEP_ORDER: Step[] = ['context', 'bump', 'commit', 'tag']

export const defCfg: ResolvedCfg = {
	manifest: 'package.json',
	flow: STEP_ORDER,
	newVersion: '',
	bump: [],
	contextFile: 'RELEASE.md',
	commitMessage: 'chore(release): {{tag}}',
	tagPrefix: 'v',
	dryRun: false,
}