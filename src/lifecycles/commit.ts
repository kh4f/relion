import { execSync } from 'node:child_process'
import type { ResolvedConfig } from '@/types'
import { log } from '@/utils'

export const commit = (config: ResolvedConfig): void => {
	if (!config.commit) return
	const options = config.commit
	const command = [
		options.stageAll && 'git add -A &&',
		`git commit -m "${options.message}"`,
		options.signOff && '-s',
		options.gpgSign && '-S',
		options.extraArgs,
	].filter(Boolean).join(' ')
	log(`Committing with command: '${command}'`)
	if (!config.dryRun) execSync(command, { stdio: 'inherit' })
}