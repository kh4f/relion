export interface Config {
	flow?: Step[]
	newVersion?: string
	bumpFiles?: (Bumper | string)[]
	contextFile?: string
	commitMessage?: string
	tagPrefix?: string
	gpgSign?: boolean
	commitFilters?: ((commit: Commit) => boolean)[]
	dryRun?: boolean
}

export type Step = 'bump' | 'context' | 'commit' | 'tag'

export interface Bumper {
	file: string
	pattern: RegExp
	replacement: string
}

export interface Commit {
	hash: string
	message: string
}