export interface Cfg {
	/** Files to bump the version in
	 * @default ['package.json']
	 */
	bump?: string[]

	/** @default Calculated from commits */
	newVersion?: string

	/** @default 'v' */
	tagPrefix?: string

	/** Commit patterns to exclude from the log
      	@default [/^ci|build|test\(/, /^chore\(deps\)(?!!)/] */
	commitsExclude?: RegExp[]

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
}

export interface Bumper {
	filePattern: RegExp
	bump: (content: string, version: string) => string
}