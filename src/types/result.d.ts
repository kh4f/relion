import type { ResolvedConfig, VersionedFile } from '@/types'

export interface RelionResult {
	resolvedConfig: ResolvedConfig
	generatedChangelog: string | null
	commitCommand: string | null
	tagCommand: string | null
	bumpResults: BumpResult[] | null
}

export interface BumpResult extends VersionedFile {
	oldVersion: string | null
	newVersion: string
}