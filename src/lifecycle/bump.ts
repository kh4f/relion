import { readFileSync, writeFileSync } from 'node:fs'
import type { ResolvedConfig } from '@/types'
import { log } from '@/utils'

export const bump = (config: ResolvedConfig) => {
	if (!config.bump) return null
	const bumpFiles = config.bump, newVersion = config.context.newVersion

	bumpFiles.forEach(versionedFile => {
		const fileContent = readFileSync(versionedFile.file, 'utf8')
		const updatedContent = fileContent.replace(versionedFile.pattern, versionedFile.replacement.replace('{{newVersion}}', newVersion))
		if (!config.dryRun) writeFileSync(versionedFile.file, updatedContent, 'utf8')
		log(`Updated version in '${versionedFile.file}' to '${newVersion}'`)
	})
}