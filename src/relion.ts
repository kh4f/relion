import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { bump, context, commit, tag } from '@/steps'
import { defaultCfg, STEP_ORDER, defaultManifestFiles } from '@/defaults'
import { calculateNextVersion, getRepoInfo, parseCommits, parseManifest } from '@/utils'
import type { Config, RepoInfo } from '@/types'

export const relion = async (userCfg: Config) => {
	let manifest: RepoInfo
	if (userCfg.manifest && !existsSync(userCfg.manifest))
		throw new Error(`Specified manifest file '${userCfg.manifest}' does not exist`)
	const manifestFile = userCfg.manifest ?? defaultManifestFiles.find(existsSync)
	if (manifestFile) {
		console.log(`Manifest file: ${manifestFile}`)
		manifest = parseManifest(manifestFile)
	} else {
		console.log(`No manifest file found, using repository info`)
		manifest = getRepoInfo()
	}

	console.log(`Project: ${manifest.name}`)
	console.log(`Repo: ${manifest.url}`)

	const cfg = { ...defaultCfg, ...userCfg }

	if (!userCfg.tagPrefix && manifest.name.startsWith('@')) cfg.tagPrefix = `${manifest.name}@`

	const curTag = spawnSync('git', [
		'describe', '--match', `${cfg.tagPrefix}[0-9]*.[0-9]*.[0-9]*`, '--abbrev=0',
	], { encoding: 'utf8' }).stdout.trim()
	console.log(`Current tag: ${curTag}`)

	const curVersion = /\d+\.\d+\.\d+.*/.exec(curTag)?.[0] ?? '0.0.0'
	console.log(`Current version: ${curVersion}`)

	const parsedCommits = parseCommits(curTag)
	console.log(`Parsed commits: ${parsedCommits.length}`)

	cfg.newVersion ||= calculateNextVersion(parsedCommits, curVersion)
	console.log(`New version: ${cfg.newVersion}`)

	const newTag = `${cfg.tagPrefix}${cfg.newVersion}`
	console.log(`New tag: ${newTag}`)

	cfg.commitMessage = cfg.commitMessage.replace('{{tag}}', newTag)
	console.log(`Commit message: '${cfg.commitMessage}'`)

	console.log('-'.repeat(30))

	for (const step of STEP_ORDER.filter(s => cfg.flow.includes(s))) await ({
		context: () => context(cfg, parsedCommits, curTag, newTag, manifest.url),
		bump: () => bump(cfg),
		commit: () => commit(cfg),
		tag: () => tag(cfg, curTag, newTag),
	})[step]()
}