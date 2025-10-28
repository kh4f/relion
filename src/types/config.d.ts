import type { ParsedCommit, RawCommit, ReleaseWithTypeGroups, TypeGroupsMap, ResolvedCommit } from '@/types'
import type { HelperDeclareSpec } from 'handlebars'

export interface UserConfig {
	lifecycle?: LifecycleStep[] | 'all'
	bump?: (string | Bumper)[]
	changelog?: ChangelogOptions
	commit?: CommitOptions
	tag?: TagOptions
	tagPrefix?: string
	tagFormat?: string
	versionSource?: 'manifestFile' | 'latest-release-tag'
	manifestFile?: string | Bumper
	commitsScope?: string
	releaseType?: ReleaseType
	zeroMajorBreakingIsMinor?: boolean
	context?: Context
	commitsParser?: CommitsParser
	prevReleaseTagPattern?: '{{newTagFormat}}' | RegExp
	dryRun?: boolean
	profile?: string
	logLevel?: 'info' | 'info-clean' | 'silent'
	[profile: `_${string}`]: UserConfig | undefined
}

type OptionalKeys = LifecycleStep | 'releaseType' | 'profile' | 'tagPrefix'
export interface MergedConfig extends Omit<Required<UserConfig>, OptionalKeys>, Pick<UserConfig, OptionalKeys> {
	lifecycle: LifecycleStep[]
	changelog?: CompleteChangelogOptions
	commit?: CompleteCommitOptions
	tag?: CompleteTagOptions
	commitsParser: CompleteCommitsParser
}
export interface TransformedConfig extends Omit<MergedConfig, 'changelog'> {
	manifestFile: Bumper
	bump?: Required<Bumper[]>
	changelog?: ResolvedChangelogOptions
	prevReleaseTagPattern: RegExp
}

export interface ResolvedConfig extends TransformedConfig {
	context: ResolvedContext
}

export interface ChangelogOptions {
	file?: string
	output?: 'file' | 'stdout'
	commitRange?: CommitRange
	extractFromFile?: boolean | 'latest-release' | (string & {})
	sections?: TypeGroupsMap
	header?: string
	releasePattern?: RegExp
	commitRefLinkPattern?: RegExp
	groupCommitsByScope?: boolean
	maxLinesPerRelease?: number
	helpers?: HelperDeclareSpec
	partials?: Record<string, string | ((fallback: string) => string)>
	review?: boolean
}
export type CompleteChangelogOptions = Required<ChangelogOptions>
export interface ResolvedChangelogOptions extends Omit<CompleteChangelogOptions, 'partials'> {
	compiledPartials: Record<string, HandlebarsTemplateDelegate> | string
	latestReleasePattern: RegExp
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
	message?: '{{commitMessage}}' | (string & {})
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
	[key: string]: unknown
}
export interface PackageInfo {
	name?: string
	version?: string
	[key: string]: unknown
}
export interface Context {
	commits?: (ParsedCommit | RawCommit | string)[]
	currentVersion?: string
	currentTag?: string
	newVersion?: string
	newTag?: string
	repo?: RepoInfo
	package?: PackageInfo
	commitRefLinks?: boolean
	footerChangelogUrl?: boolean
	[key: string]: unknown
}
export interface ResolvedContext extends Required<Context> {
	commits: ResolvedCommit[]
	releases: ReleaseWithTypeGroups[] | null
}

export type LifecycleStep = 'bump' | 'changelog' | 'commit' | 'tag'

export type LogLevel = 'info' | 'info-clean' | 'silent'

export type CommitRange = 'all' | 'unreleased' | 'latest-release' | { releaseTag: string } | (string & {})

export type ReleaseType = 'major' | 'minor' | 'patch'

export interface Bumper {
	file: string
	pattern: RegExp
	replacement: string
}
export interface DefaultBumper extends Omit<Bumper, 'file'> {
	file: RegExp
}