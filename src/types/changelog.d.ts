import type { ResolvedCommit, ResolvedContext } from '@/types'
import { defaultChangelogSections } from '@/defaults'

export interface TypeGroupDefinition {
	title: string
	commitType: 'breaking' | '*' | (string & {}) | string[]
	filter?: (commit: ResolvedCommit) => boolean
	show?: 'only-breaking' | 'never'
}
export type TypeGroupsMap = Record<string, TypeGroupDefinition>

export interface ScopeGroup {
	scope: string
	commits: ResolvedCommit[]
}

export interface FilledTypeGroup extends Omit<TypeGroupDefinition, 'filter'> {
	commits: ResolvedCommit[]
	scopeGroups?: ScopeGroup[]
}

export type FilledTypeGroupMap = Record<string, FilledTypeGroup>

export interface ReleaseWithFlatCommits {
	tag: string
	version?: string
	date?: string
	commits: ResolvedCommit[]
}

export interface ReleaseWithTypeGroups extends Omit<ReleaseWithFlatCommits, 'commits'> {
	commitTypeGroups: FilledTypeGroupMap
}

export interface ReleaseContext extends ReleaseWithTypeGroups, ResolvedContext {
	prevRelease: Partial<ReleaseWithTypeGroups>
}

export type DefaultChangelogSections = typeof defaultChangelogSections

export interface SectionsSelector extends DefaultChangelogSections {
	pick(...keys: (keyof DefaultChangelogSections)[]): Partial<DefaultChangelogSections>
	omit(...keys: (keyof this)[]): SectionsSelector
	modify(key: keyof DefaultChangelogSections, modify: (section: TypeGroupDefinition) => TypeGroupDefinition): Partial<DefaultChangelogSections>
}