import type { ResolvedConfig } from '@/types'

export interface RelionResult {
	resolvedConfig: ResolvedConfig
	generatedChangelog?: string
	commitCommand?: string
	tagCommand?: string
}