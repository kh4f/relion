import { readFileSync, writeFileSync } from 'node:fs'
import type { ResolvedConfig } from '@/types'

export const bump = (config: ResolvedConfig): void => {
	if (!config.bump) return
	const bumpFiles = config.bump, newVersion = config.context.newVersion
	bumpFiles.forEach((versionedFile) => {
		const fileContent = readFileSync(versionedFile.filePath, 'utf8')
		const updatedContent = fileContent.replace(versionedFile.versionPattern, `$1${newVersion}$3`)
		if (!config.dryRun) writeFileSync(versionedFile.filePath, updatedContent, 'utf8')
		console.log(`Updated version in '${versionedFile.filePath}' to '${newVersion}'`)
	})
}