import type { ResolvedConfig, VersionedFile } from '@/types'

export interface RelionResult {
	resolvedConfig: ResolvedConfig
	generatedChangelog: string | null
	commitCommand?: string
	tagCommand?: string
	bumpResults?: BumpResult[]
}

export interface BumpResult extends VersionedFile {
	oldVersion: string | null
	newVersion: string
}