import type { ResolvedConfig } from '@/types'

export interface RelionResult {
	resolvedConfig: ResolvedConfig
	generatedChangelog: string | null
	commitCommand: string | null
	tagCommand: string | null
}