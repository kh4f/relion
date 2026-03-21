export interface Cfg {
	/** Files to bump version in (package.json is always included if exists)
	 * @default ['package.json']
	 */
	bump?: string[]

	/** @default Calculated from conventional commits */
	newVersion?: string

	/** @default 'v' */
	tagPrefix?: string

	/** @default false */
	dryRun?: boolean

	/** @default false */
	yes?: boolean
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