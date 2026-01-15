export interface Config {
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
	 * - a file name for which a default bumper exists (currently only 'package.json')
	 *
	 * @default ['package.json']
	 */
	bumpFiles?: (Bumper | string)[]

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
	 * Commit log filters (substrings or regexes)
	 * @default [/^feat|^fix|^perf|^style|^docs/, 'BREAKING CHANGE']
	 */
	commitFilters?: (string | RegExp)[]

	/**
	 * Run in dry mode without making any changes
	 * @default false
	 */
	dryRun?: boolean
}

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