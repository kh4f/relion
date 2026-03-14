import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { bump, context, commit, tag } from '@/steps'
import { defCfg, STEP_ORDER } from '@/defaults'
import { calculateNextVersion, getRepoInfo, parseCommits, parseManifest } from '@/utils'
import type { Cfg, RepoInfo, ResolvedCfg } from '@/types'

export const relion = async (userCfg: Cfg) => {
	let repoInfo: RepoInfo
	if (userCfg.manifest && !existsSync(userCfg.manifest))
		throw new Error(`Specified manifest file '${userCfg.manifest}' does not exist`)
	const manifestFile = userCfg.manifest ?? [defCfg.manifest].find(existsSync)
	if (manifestFile) {
		console.log(`Using manifest file: ${manifestFile}`)
		repoInfo = parseManifest(manifestFile)
	} else {
		console.log('No manifest file found, using repository info')
		repoInfo = getRepoInfo()
	}

	console.log(`Project: ${repoInfo.name}`)
	console.log(`Repo: ${repoInfo.url}`)

	const cfg: ResolvedCfg = {
		...defCfg,
		...userCfg,
		manifest: manifestFile!,
		bump: [manifestFile!, ...(userCfg.bump ?? [])],
		tagPrefix: userCfg.tagPrefix ?? (repoInfo.name.startsWith('@')
			? `${repoInfo.name}@`
			: defCfg.tagPrefix),
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

	cfg.commitMessage = cfg.commitMessage.replace('{{tag}}', newTag)
	console.log(`Commit message: '${cfg.commitMessage}'`)

	console.log('-'.repeat(30))

	for (const step of STEP_ORDER.filter(s => cfg.flow.includes(s))) await ({
		context: () => context(cfg, commits, curTag, newTag, repoInfo.url),
		bump: () => bump(cfg),
		commit: () => commit(cfg),
		tag: () => tag(cfg, curTag, newTag),
	})[step]()
}