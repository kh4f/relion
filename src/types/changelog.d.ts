import type { Commit, ResolvedContext } from '@/types'

export interface ChangelogSectionDefinition {
	title: string
	commitType: 'breaking' | '*' | (string & {}) | string[]
	filter?: (commit: Commit) => boolean
}
export type ChangelogSectionsMap = Record<string, ChangelogSectionDefinition>

export interface ResolvedChangelogSection extends Omit<ChangelogSectionDefinition, 'filter'> {
	id: string
	commits: Commit[]
}

export interface ReleaseWithFlatCommits {
	tag: string
	version?: string
	date?: string
	commits: Commit[]
}

export interface ReleaseWithGroupedCommits extends Omit<ReleaseWithFlatCommits, 'commits'> {
	commitTypeGroups: ResolvedChangelogSection[]
}

export interface ReleaseContext extends ReleaseWithGroupedCommits, ResolvedContext {
	prevTag?: string
	prevVersion?: string
}