import type { ResolvedCommit, ResolvedContext } from '@/types'
import { defaultChangelogSections } from '@/defaults'

export interface TypeGroupDefinition {
	title: string
	commitType: 'breaking' | '*' | (string & {}) | string[]
	filter?: (commit: ResolvedCommit) => boolean
}
export type TypeGroupsMap = Record<string, TypeGroupDefinition>

export interface FilledTypeGroup extends Omit<TypeGroupDefinition, 'filter'> {
	commits: ResolvedCommit[]
}
export type FilledTypeGroupMap = Record<string, FilledTypeGroup>

export interface ReleaseWithFlatCommits {
	tag: string
	version?: string
	date?: string
	commits: ResolvedCommit[]
}

export interface ReleaseWithGroupedCommits extends Omit<ReleaseWithFlatCommits, 'commits'> {
	commitTypeGroups: FilledTypeGroupMap
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