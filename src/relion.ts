import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { bump, context, commit, tag } from '@/steps'
import { defaultCfg, STEP_ORDER, defaultManifestFiles } from '@/defaults'
import { calculateNextVersion, parseCommits, parseManifest } from '@/utils'
import type { Config } from '@/types'

export default async function relion(userCfg?: Config) {
	if (userCfg?.manifest && !existsSync(userCfg.manifest))
		throw new Error(`Specified manifest file '${userCfg.manifest}' does not exist`)
	const manifestFile = userCfg?.manifest ?? defaultManifestFiles.find(existsSync)
	if (!manifestFile) throw new Error('No manifest file found, please specify one')

	console.log('-'.repeat(30))
	console.log(`Manifest file: ${manifestFile}`)

	const manifest = parseManifest(manifestFile)
	userCfg = { ...manifest.relion, ...userCfg }
	const cfg = { ...defaultCfg, ...userCfg }

	if (!userCfg.tagPrefix && manifest.name.startsWith('@')) cfg.tagPrefix = `${manifest.name}@`

	const curVersion = manifest.version
	console.log(`Current version: ${curVersion}`)

	const curTag = spawnSync('git', [
		'describe', '--match', `${cfg.tagPrefix}[0-9]*.[0-9]*.[0-9]*`, '--abbrev=0',
	], { encoding: 'utf8' }).stdout.trim()
	console.log(`Current tag: ${curTag}`)

	const parsedCommits = parseCommits(curTag)
	console.log(`Parsed commits: ${parsedCommits.length}`)

	cfg.newVersion ||= calculateNextVersion(parsedCommits, curVersion)
	console.log(`New version: ${cfg.newVersion}`)

	const newTag = `${cfg.tagPrefix}${cfg.newVersion}`
	console.log(`New tag: ${newTag}`)

	cfg.commitMessage = cfg.commitMessage.replace('{{tag}}', newTag)
	console.log(`Commit message: '${cfg.commitMessage}'`)

	const repoURL = manifest.repository
	console.log(`Repo URL: ${repoURL}`)

	console.log('-'.repeat(30))

	for (const step of STEP_ORDER.filter(s => cfg.flow.includes(s))) await ({
		context: () => context(cfg, parsedCommits, curTag, newTag, repoURL),
		bump: () => bump(cfg),
		commit: () => commit(cfg),
		tag: () => tag(cfg, curTag, newTag),
	})[step]()
}