import { execSync } from 'node:child_process'
import type { ResolvedConfig } from '@/types'

export const tag = (config: ResolvedConfig): void => {
	if (!config.tag) return
	const options = config.tag
	console.log('Tagging with options:', options)
	if (!config.dryRun) execSync(`git tag -a ${options.name} -m "${options.message}" ${options.gpgSign ? '-s' : ''} ${options.force ? '-f' : ''} ${options.extraArgs}`, { stdio: 'inherit' })
}