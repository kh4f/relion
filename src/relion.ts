import { readFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { bump, context, commit, tag } from '@/steps'
import { defaultCfg } from '@/defaults'
import { calculateNextVersion, parseCommits } from '@/utils'
import type { Config } from '@/types'

export default function relion(userCfg?: Config) {
	const cfg = { ...defaultCfg, ...userCfg }

	console.log('-'.repeat(30))

	const pkgJson = JSON.parse(readFileSync('package.json', 'utf8')) as { version: string, repository: string }
	const curVersion = pkgJson.version
	console.log(`Current version: ${curVersion}`)

	const curTag = execSync(`git describe --match "${cfg.tagPrefix}*" --abbrev=0`, { encoding: 'utf8' }).trim()
	console.log(`Current tag: ${curTag}`)

	const parsedCommits = parseCommits(curTag)
	const filteredCommits = parsedCommits.filter(c => cfg.commitFilters.some(f => f(c)))
	console.log(`Filtered commits: ${filteredCommits.length}`)

	cfg.newVersion ||= calculateNextVersion(filteredCommits, curVersion)
	console.log(`New version: ${cfg.newVersion}`)

	const newTag = `${cfg.tagPrefix}${cfg.newVersion}`
	console.log(`New tag: ${newTag}`)

	cfg.commitMessage = cfg.commitMessage.replace('{{tag}}', newTag)
	console.log(`Commit message: '${cfg.commitMessage}'`)

	const repoURL = pkgJson.repository
	console.log(`Repo URL: ${repoURL}`)

	console.log('-'.repeat(30))

	for (const step of cfg.flow) ({
		bump: () => bump(cfg),
		context: () => context(cfg, filteredCommits, curTag, newTag, repoURL),
		commit: () => commit(cfg),
		tag: () => tag(cfg, newTag),
	})[step]()
}