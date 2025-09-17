import { execSync } from 'node:child_process'
import type { ResolvedConfig } from '@/types'
import { log } from '@/utils'

export const tag = (config: ResolvedConfig): void => {
	if (!config.tag) return
	const options = config.tag
	const command = [
		`git tag -a ${options.name}`,
		`-m "${options.message}"`,
		options.gpgSign && '-s',
		options.force && '-f',
		options.extraArgs,
	].filter(Boolean).join(' ')
	log(`Tagging with command: '${command}'`)
	if (!config.dryRun) execSync(command, { stdio: 'inherit' })
}