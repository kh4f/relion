import type { Commit, ResolvedContext } from '@/types'

export interface ChangelogSectionDefinition {
	title: string
	commitType: 'breaking' | '*' | (string & {}) | string[]
	filter?: (commit: Commit) => boolean
}

export interface ResolvedChangelogSection extends Omit<ChangelogSectionDefinition, 'filter'> {
	commits: Commit[]
}

export interface ReleaseWithFlatCommits {
	tag: string
	version?: string
	date?: string
	commits: Commit[]
}

export interface ReleaseWithGroupedCommits extends Omit<ReleaseWithFlatCommits, 'commits'> {
	commitGroups: ResolvedChangelogSection[]
}

export interface ReleaseContext extends ReleaseWithGroupedCommits, ResolvedContext {
	prevTag?: string
	prevVersion?: string
}

export type ChangelogSectionsMap = Record<string, ChangelogSectionDefinition>

export interface DefaultChangelogSections extends ChangelogSectionsMap {
	[Symbol.iterator](): Iterator<ChangelogSectionDefinition>
}