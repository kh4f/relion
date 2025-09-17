import { readFileSync, writeFileSync } from 'node:fs'
import type { ResolvedConfig, BumpResult } from '@/types'
import { log } from '@/utils'

export const bump = (config: ResolvedConfig): BumpResult[] | null => {
	if (!config.bump) return null
	const bumpFiles = config.bump, newVersion = config.context.newVersion

	return bumpFiles.map((versionedFile) => {
		const fileContent = readFileSync(versionedFile.filePath, 'utf8')
		const oldVersion = versionedFile.versionPattern.exec(fileContent)?.[2] ?? null
		const updatedContent = fileContent.replace(versionedFile.versionPattern, `$1${newVersion}$3`)
		if (!config.dryRun) writeFileSync(versionedFile.filePath, updatedContent, 'utf8')
		log(`Updated version in '${versionedFile.filePath}' to '${newVersion}'`)
		return { ...versionedFile, oldVersion, newVersion }
	})
}