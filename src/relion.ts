import { spawnSync } from 'node:child_process'
import { bump, context, commit, tag } from '@/steps'
import { defCfg } from '@/defaults'
import { calculateNextVersion, getRepoInfo, parseCommits } from '@/utils'
import type { Cfg, ResolvedCfg } from '@/types'

export const relion = async (userCfg: Cfg) => {
	const repoInfo = getRepoInfo()

	console.log(`Project: ${repoInfo.name}`)
	console.log(`Repo: ${repoInfo.url}`)

	const cfg: ResolvedCfg = {
		...defCfg,
		...userCfg,
		bump: [...defCfg.bump, ...(userCfg.bump ?? [])],
	}

	const curTag = spawnSync('git', [
		'describe', '--match', `${cfg.tagPrefix}[0-9]*.[0-9]*.[0-9]*`, '--abbrev=0',
	], { encoding: 'utf8' }).stdout.trim()
	console.log(`Current tag: ${curTag}`)

	const curVersion = /\d+\.\d+\.\d+.*/.exec(curTag)?.[0] ?? '0.0.0'
	console.log(`Current version: ${curVersion}`)

	const commits = parseCommits(curTag)
	console.log(`Parsed commits: ${commits.length}`)

	cfg.newVersion ||= calculateNextVersion(commits, curVersion)
	console.log(`New version: ${cfg.newVersion}`)

	const newTag = `${cfg.tagPrefix}${cfg.newVersion}`
	console.log(`New tag: ${newTag}`)

	const commitMsg = `chore(release): ${newTag}`
	console.log(`Commit message: '${commitMsg}'`)

	console.log('-'.repeat(30))

	console.log(`\n('' to continue / 's' to skip)`)
	await context(cfg, commits, curTag, newTag, repoInfo.url)
	await bump(cfg)
	await commit(cfg, commitMsg)
	await tag(cfg, newTag, commitMsg)
}