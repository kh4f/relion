import type { Bumper, Step, ResolvedConfig } from '@/types'

export const STEP_ORDER: Step[] = ['context', 'bump', 'commit', 'tag']

export const defaultBumper: Bumper = {
	file: ['package.json', 'Cargo.toml'],
	pattern: /(\bversion\b.*?)\d[\w.+-]*/,
	replacement: '$1{{newVersion}}',
}

export const defaultManifestFiles = ['package.json', 'Cargo.toml']

export const defaultCfg: ResolvedConfig = {
	flow: [],
	newVersion: '',
	bump: defaultManifestFiles,
	contextFile: 'RELEASE.md',
	commitMessage: 'chore(release): {{tag}}',
	tagPrefix: 'v',
	dryRun: false,
}