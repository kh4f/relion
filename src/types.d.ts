export interface Cfg {
	/** Manifest file path (used to detect the package name and repo URL)
	 * @default Autodetects 'package.json' or uses git info
	 */
	manifest?: string

	/** Files to bump version in (manifest is always included if exists)
	 * @default [<manifest>]
	 */
	bump?: string[]

	/** New version for the release
	 * @default Auto-determined from conventional commits
	 */
	newVersion?: string

	/** Release commit message template
	 * @default 'chore(release): {{tag}}'
	 */
	commitMessage?: string

	/** Release tag prefix
	 * @default 'v'
	 */
	tagPrefix?: string

	/** Dry run mode
	 * @default false
	 */
	dryRun?: boolean
}

export type ResolvedCfg = Required<Cfg>

export interface Commit {
	hash: string
	message: string
}

export interface RepoInfo {
	name: string
	url: string
	relion?: Cfg
}