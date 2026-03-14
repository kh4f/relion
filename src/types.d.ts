export interface Cfg {
	/** Files to bump version in (`package.json` is always included if exists)
	 * @default ['package.json']
	 */
	bump?: string[]

	/** New version for the release
	 * @default Auto-determined from conventional commits
	 */
	newVersion?: string

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