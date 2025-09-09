import { execSync } from 'node:child_process'
import type { ResolvedConfig } from '@/types'
import { log } from '@/utils'

export const tag = (config: ResolvedConfig): void => {
	if (!config.tag) return
	const options = config.tag
	log('Tagging with options:', options)
	if (!config.dryRun) execSync(`git tag -a ${options.name} -m "${options.message}" ${options.gpgSign ? '-s' : ''} ${options.force ? '-f' : ''} ${options.extraArgs}`, { stdio: 'inherit' })
}