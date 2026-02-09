import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { bump, context, commit, tag } from '@/steps'
import { defaultCfg, STEP_ORDER } from '@/defaults'
import { calculateNextVersion, parseCommits, filterCommits } from '@/utils'
import type { Config } from '@/types'

export default async (userCfg?: Config) => {
	const pkgJson = JSON.parse(readFileSync('package.json', 'utf8')) as
		{ name: string, version: string, repository: string, relion?: Partial<Config> }
	userCfg = { ...pkgJson.relion, ...userCfg }
	const cfg = { ...defaultCfg, ...userCfg }

	console.log('-'.repeat(30))

	if (!userCfg.tagPrefix && pkgJson.name.startsWith('@')) cfg.tagPrefix = `${pkgJson.name}@`

	const curVersion = pkgJson.version
	console.log(`Current version: ${curVersion}`)

	const curTag = spawnSync('git', [
		'describe', '--match', `${cfg.tagPrefix}[0-9]*.[0-9]*.[0-9]*`, '--abbrev=0',
	], { encoding: 'utf8' }).stdout.trim()
	console.log(`Current tag: ${curTag}`)

	const parsedCommits = parseCommits(curTag)
	const filteredCommits = filterCommits(parsedCommits, cfg.commitFilters)
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

	for (const step of STEP_ORDER.filter(s => cfg.flow.includes(s))) await ({
		context: () => context(cfg, filteredCommits, curTag, newTag, repoURL),
		bump: () => bump(cfg),
		commit: () => commit(cfg),
		tag: () => tag(cfg, curTag, newTag),
	})[step]()
}