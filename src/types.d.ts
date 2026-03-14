export interface Cfg {
	/** Manifest file path. Auto-detects `package.json` or `Cargo.toml` if omitted. */
	manifest?: string

	/**
	 * Release workflow steps to execute (e.g. bump, context, commit, tag)
	 * @default []
	 */
	flow?: Step[]

	/**
	 * Explicitly set the version for the upcoming release. If not provided, the version will be determined automatically based on conventional commit messages.
	 * @default ''
	 */
	newVersion?: string

	/**
	 * Files to bump version in. Manifest is auto-included.
	 * @default ['<manifest>']
	 */
	bump?: string[]

	/**
	 * Path to the release context output file
	 * @default 'RELEASE.md'
	 */
	contextFile?: string

	/**
	 * Release commit message template
	 * @default 'chore(release): {{tag}}'
	 */
	commitMessage?: string

	/**
	 * Release tag prefix
	 * @default 'v'
	 */
	tagPrefix?: string

	/**
	 * Run in dry mode without making any changes
	 * @default false
	 */
	dryRun?: boolean
}

export type ResolvedCfg = Required<Cfg>

export type Step = 'bump' | 'context' | 'commit' | 'tag'

export interface Commit {
	hash: string
	message: string
}

export interface RepoInfo {
	name: string
	url: string
	relion?: Cfg
}