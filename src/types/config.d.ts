import type { ParsedCommit, RawCommit, ReleaseWithTypeGroups, TypeGroupsMap, ResolvedCommit } from '@/types'
import type { HelperDeclareSpec } from 'handlebars'

export type FalseOrComplete<T> = false | Required<T>

export interface UserConfig {
	bump?: boolean | BumpFiles
	changelog?: boolean | ChangelogOptions
	commit?: boolean | CommitOptions
	tag?: boolean | TagOptions
	newTagPrefix?: string
	newTagFormat?: string
	versionSource?: 'versionSourceFile' | 'latest-release-tag'
	versionSourceFile?: string | Bumper
	commitsScope?: string
	releaseType?: ReleaseType
	zeroMajorBreakingIsMinor?: boolean
	context?: Context
	commitsParser?: CommitsParser
	prevReleaseTagPattern?: RegExp
	dryRun?: boolean
	profile?: string
	logLevel?: 'info' | 'info-clean' | 'silent'
	[profile: `_${string}`]: UserConfig | undefined
}

type OptionalKeys = 'releaseType' | 'context' | 'profile' | 'newTagPrefix'
export interface MergedConfig extends Omit<Required<UserConfig>, OptionalKeys>, Pick<UserConfig, OptionalKeys> {
	changelog: FalseOrComplete<ChangelogOptions>
	commit: FalseOrComplete<CommitOptions>
	tag: FalseOrComplete<TagOptions>
	commitsParser: CompleteCommitsParser
}
export interface TransformedConfig extends Omit<MergedConfig, 'changelog'> {
	versionSourceFile: Bumper
	bump: FalseOrComplete<Bumper[]>
	changelog: false | ResolvedChangelogOptions
}

export interface ResolvedConfig extends TransformedConfig {
	context: ResolvedContext
}
export type BumpFiles = (string | Bumper)[]

export interface ChangelogOptions {
	output?: 'stdout' | (string & {})
	commitRange?: CommitRange
	sections?: TypeGroupsMap
	header?: string
	prevReleaseHeaderPattern?: RegExp
	groupCommitsByScope?: boolean
	maxLinesPerRelease?: number
	helpers?: HelperDeclareSpec
	partials?: Record<string, string | ((fallback: string) => string)>
	review?: boolean
}
export type CompleteChangelogOptions = Required<ChangelogOptions>
export interface ResolvedChangelogOptions extends Omit<CompleteChangelogOptions, 'partials'> {
	compiledPartials: Record<string, HandlebarsTemplateDelegate>
}

export interface CommitOptions {
	message?: string
	signOff?: boolean
	gpgSign?: boolean
	stageAll?: boolean
	extraArgs?: string | null
}
export type CompleteCommitOptions = Required<CommitOptions>

export interface TagOptions {
	name?: string
	message?: string
	gpgSign?: boolean
	force?: boolean
	extraArgs?: string | null
}
export type CompleteTagOptions = Required<TagOptions>

export interface CommitsParser {
	breakingChangesPattern?: RegExp
	breakingChangeListPattern?: RegExp
	headerPattern?: RegExp
	tagPattern?: RegExp
	coAuthorPattern?: RegExp
	ghEmailPattern?: RegExp
	refPattern?: RegExp
	refActionPattern?: RegExp
	refLabelPattern?: RegExp
	remoteUrlPattern?: RegExp
	signerPattern?: RegExp
	dateSource?: 'authorDate' | 'committerDate'
	dateFormat?: 'US' | 'ISO' | (string & {})
	revertCommitBodyPattern?: RegExp
}
export type CompleteCommitsParser = Required<CommitsParser>

export interface RepoInfo {
	host?: string
	owner?: string
	name?: string
	homepage?: string
}
export interface Context {
	commits?: (ParsedCommit | RawCommit | string)[]
	currentVersion?: string
	currentTag?: string
	newVersion?: string
	newTag?: string
	repo?: RepoInfo
	[key: string]: unknown
}
export interface ResolvedContext extends Required<Context> {
	commits: ResolvedCommit[]
	releases: ReleaseWithTypeGroups[] | null
}

export type LogLevel = 'info' | 'info-clean' | 'silent'

export type CommitRange =
	| 'all'
	| 'unreleased'
	| 'latest-release'
	| { releaseTag: string }
	| (string & {})

export type ReleaseType = 'major' | 'minor' | 'patch'

export interface Bumper {
	file: string
	pattern: RegExp
	replacement: string
}
export interface DefaultBumper extends Omit<Bumper, 'file'> {
	file: RegExp
}