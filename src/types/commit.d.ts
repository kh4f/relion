import type { GpgSigLabel, RefType } from '@/enums'

export type RawCommit = CommitMessageString | {
	hash?: string
	message: string
	tagRefs?: string
	authorName?: string
	authorEmail?: string
	authorTs?: string
	committerName?: string
	committerEmail?: string
	committerTs?: string
	gpgSigCode?: GpgSigCode
	gpgSigKeyId?: string
}

export interface ParsedCommit extends CommitMessage {
	hash: string
	tags?: string[]
	authors?: Contributor[]
	committer?: Contributor
	refs?: Reference[]
	gpgSig?: GpgSig
	date?: string
	associatedReleaseTag?: string | null
	isReverted?: 'inTheSameRelease' | 'inOtherRelease' | null
}

interface ParsedCommitWithReleaseTag extends ParsedCommit {
	associatedReleaseTag: string
}

export interface ResolvedCommit extends ParsedCommitWithReleaseTag {
	isReverted: 'inTheSameRelease' | 'inOtherRelease' | null
}

export interface CommitMessage {
	type: string
	scope?: string
	subject: string
	body?: string
	breakingChanges?: string | string[]
	footer?: string
}
type CommitMessageString = string

export interface Reference {
	action: string
	type?: RefType
	owner?: string
	repo?: string
	number: string
}

export type RefLabel = Pick<Reference, 'owner' | 'repo' | 'number'>

export interface Contributor {
	name: string
	email: string
	hasSignedOff?: boolean
	ghLogin?: string
	ghUrl?: string
}

export type GithubUserInfo = Pick<Contributor, 'ghLogin' | 'ghUrl'>

export interface GpgSig {
	code: GpgSigCode
	label: GpgSigLabel
	keyId?: string
}

export type GpgSigCode = 'G' | 'B' | 'U' | 'X' | 'Y' | 'R' | 'E' | 'N'

export interface RawReference {
	action: string
	labels: string
}