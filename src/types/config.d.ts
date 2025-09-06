import type { Commit, RawCommit, ChangelogSectionDefinition, ReleaseWithGroupedCommits } from '@/types'
import type { HelperDeclareSpec } from 'handlebars'

export type FalseOrComplete<T> = false | Required<T>

export interface UserConfig {
	bump?: boolean | BumpFiles
	changelog?: boolean | ChangelogOptions
	commit?: boolean | CommitOptions
	tag?: boolean | TagOptions
	newTagFormat?: string
	versionSourceFile?: string | VersionedFile
	releaseVersion?: string
	releaseType?: ReleaseType
	context?: Context
	commitsParser?: CommitsParser
	prevReleaseTagPattern?: RegExp
	dryRun?: boolean
}

type OptionalKeys = 'releaseVersion' | 'releaseType' | 'context'
export interface MergedConfig extends Omit<Required<UserConfig>, OptionalKeys>, Pick<UserConfig, OptionalKeys> {
	changelog: FalseOrComplete<ChangelogOptions>
	commit: FalseOrComplete<CommitOptions>
	tag: FalseOrComplete<TagOptions>
	commitsParser: CompleteCommitsParser
}
export interface TransformedConfig extends Omit<MergedConfig, 'changelog'> {
	versionSourceFile: VersionedFile
	bump: FalseOrComplete<VersionedFile[]>
	changelog: false | ResolvedChangelogOptions
}

export interface ContextualConfig extends TransformedConfig {
	context: ResolvedContext
}
export type ResolvedConfig = ContextualConfig

export type BumpFiles = (string | VersionedFile)[]

export interface ChangelogOptions {
	stdout?: boolean
	outputFile?: string
	commitRange?: CommitRange
	sections?: ChangelogSectionDefinition[]
	header?: string
	prevReleaseHeaderPattern?: RegExp
	helpers?: HelperDeclareSpec
	partials?: Record<string, string>
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
	extraArgs?: string
}
export type CompleteCommitOptions = Required<CommitOptions>

export interface TagOptions {
	name?: string
	message?: string
	gpgSign?: boolean
	force?: boolean
	extraArgs?: string
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
	dateFormat?: string
}
export type CompleteCommitsParser = Required<CommitsParser>

export interface RepoInfo {
	host?: string
	owner?: string
	name?: string
	homepage?: string
}
export interface Context {
	commits?: Commit[] | RawCommit[]
	currentVersion?: string
	currentTag?: string
	newVersion?: string
	newTag?: string
	repo?: RepoInfo
	[key: string]: unknown
}
export interface ResolvedContext extends Required<Context> {
	commits: Commit[]
	releases: ReleaseWithGroupedCommits[] | null
}

export type CommitRange =
	| 'all'
	| 'unreleased'
	| { versionTag: string }
	| { from: 'firstCommit' | (string & {}) }
	| { to: 'HEAD' | (string & {}) }
	| { from: 'firstCommit' | (string & {}), to: 'HEAD' | (string & {}) }

export type ReleaseType = 'major' | 'minor' | 'patch'

export interface VersionedFile {
	filePath: string
	versionPattern: RegExp
}
export interface DefaultVersionedFile extends Omit<VersionedFile, 'filePath'> {
	filePathRegex: RegExp
}