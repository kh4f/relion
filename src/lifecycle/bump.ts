import { readFileSync, writeFileSync } from 'node:fs'
import type { ResolvedConfig } from '@/types'
import { log } from '@/utils'

export const bump = (config: ResolvedConfig) => {
	if (!config.bump) return null
	const bumpFiles = config.bump, newVersion = config.context.newVersion

	bumpFiles.forEach(bumper => {
		const fileContent = readFileSync(bumper.file, 'utf8')
		const updatedContent = fileContent.replace(bumper.pattern, bumper.replacement.replace('{{newVersion}}', newVersion))
		if (!config.dryRun) writeFileSync(bumper.file, updatedContent, 'utf8')
		log(`Updated version in '${bumper.file}' to '${newVersion}'`)
	})
}