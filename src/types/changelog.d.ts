import type { ParsedCommit, ResolvedContext } from '@/types'
import { defaultChangelogSections } from '@/defaults'

export interface ChangelogSectionDefinition {
	title: string
	commitType: 'breaking' | '*' | (string & {}) | string[]
	filter?: (commit: ParsedCommit) => boolean
}
export type ChangelogSectionsMap = Record<string, ChangelogSectionDefinition>

export interface ResolvedChangelogSection extends Omit<ChangelogSectionDefinition, 'filter'> {
	id: string
	commits: ParsedCommit[]
}

export interface ReleaseWithFlatCommits {
	tag: string
	version?: string
	date?: string
	commits: ParsedCommit[]
}

export interface ReleaseWithGroupedCommits extends Omit<ReleaseWithFlatCommits, 'commits'> {
	commitTypeGroups: ResolvedChangelogSection[]
}

export interface ReleaseContext extends ReleaseWithGroupedCommits, ResolvedContext {
	prevTag?: string
	prevVersion?: string
}

export type DefaultChangelogSections = typeof defaultChangelogSections

export interface ChangelogSectionsSelector extends DefaultChangelogSections {
	pick(...keys: (keyof DefaultChangelogSections)[]): Partial<DefaultChangelogSections>
	omit(...keys: (keyof DefaultChangelogSections)[]): Partial<DefaultChangelogSections>
}