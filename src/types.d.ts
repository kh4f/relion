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
	 * - a bumper object specifying `file`, `pattern`, and `replacement`
	 * - a file name for which a default bumper exists (currently only 'package.json')
	 *
	 * @default ['package.json']
	 */
	bumpFiles?: (Bumper | string)[]

	/**
	 * Path to the release context file
	 * @default 'RELEASE.md'
	 */
	contextFile?: string

	/**
	 * Release commit message
	 * @default 'chore(release): {{tag}}'
	 */
	commitMessage?: string

	/**
	 * Release tag prefix
	 * @default 'v'
	 */
	tagPrefix?: string

	/**
	 * Filters to select which commits to output in the release context
     * @default [
     *   c => /^feat|^fix|^perf|^style|^docs/.test(c.message),
     *   c => c.message.includes('BREAKING CHANGE')
     * ]
	 */
	commitFilters?: ((commit: Commit) => boolean)[]

	/**
	 * Run in dry mode without making any changes
	 * @default false
	 */
	dryRun?: boolean
}

export type Step = 'bump' | 'context' | 'commit' | 'tag'

export interface Bumper {
	/** Path to the file to bump version in */
	file: string

	/** Regex to find the version string in the file */
	pattern: RegExp

	/** Replacement string for the version (use `{{newVersion}}` as a placeholder) */
	replacement: string
}

export interface Commit {
	/** Commit hash */
	hash: string

	/** Full commit  message */
	message: string
}