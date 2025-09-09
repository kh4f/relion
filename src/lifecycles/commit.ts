import { execSync } from 'node:child_process'
import type { ResolvedConfig } from '@/types'
import { log } from '@/utils'

export const commit = (config: ResolvedConfig): void => {
	if (!config.commit) return
	const options = config.commit
	log('Committing with options:', options)
	if (options.stageAll && !config.dryRun) execSync('git add -A', { stdio: 'inherit' })
	if (!config.dryRun) execSync(`git commit -m "${options.message}" ${options.signOff ? '-s' : ''} ${options.gpgSign ? '-S' : ''} ${options.extraArgs}`, { stdio: 'inherit' })
}