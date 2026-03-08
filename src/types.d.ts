export interface Config {
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
	 * Files or bumpers for version update. Each item is either:
	 * - a Bumper object specifying `file`, `pattern`, and `replacement`
	 * - a file name for which a default bumper exists (currently only 'package.json', 'Cargo.toml')
	 *
	 * If a file doesn't exist, it will be skipped silently.
	 *
	 * @default ['package.json', 'Cargo.toml']
	 */
	bump?: (Bumper | string)[]

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

export type ResolvedConfig = Required<Omit<Config, 'manifest'>>

export type Step = 'bump' | 'context' | 'commit' | 'tag'

export interface Bumper {
	/** Path or array of paths to the file(s) to bump version in */
	file: string | string[]

	/** Pattern to locate the version string (RegExp or a stringified RegExp) */
	pattern: RegExp | string

	/** Replacement string for the version (use `{{newVersion}}` as a placeholder) */
	replacement: string
}

export interface Commit {
	/** Commit hash */
	hash: string

	/** Full commit  message */
	message: string
}

export interface Manifest {
	name: string
	version: string
	repository: string
	relion?: Partial<Config>
}