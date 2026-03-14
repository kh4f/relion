import { readFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { createInterface } from 'node:readline'
import semver from 'semver'
import type { Cfg, Commit, RepoInfo } from '@/types'

export const getRepoInfo = (): RepoInfo => {
	const remote = execSync('git config --get remote.origin.url', { encoding: 'utf8' }).trim()
	const url = /(github\.com.*?)(\.git)?$/.exec(remote)?.[1] ?? ''
	const name = url.split('/').at(-1) ?? ''
	return { url, name }
}

export const parseManifest = (manifestFile: string): RepoInfo => {
	const content = readFileSync(manifestFile, 'utf8')

	const name = /name.*"(.*?)"/.exec(content)?.[1]
	if (!name) throw new Error(`Manifest is missing 'name' field`)

	const url = /repository.*"(.*?)"/.exec(content)?.[1]
	if (!url) throw new Error(`Manifest is missing 'repository' field`)

	const relionRaw = manifestFile.endsWith('.json') ? /relion.*({.*?})/s.exec(content)?.[1] : undefined
	const relion = relionRaw ? (JSON.parse(relionRaw) as Cfg) : undefined

	return { name, url, relion }
}

export const parseCommits = (curTag: string): Commit[] => (
	execSync(`git log ${curTag ? `${curTag}..` : ''} --format="%h %B---" .`, { encoding: 'utf8' }).trim()
		.split('---').filter(Boolean)
		.map(c => /^(.+?) (.+)/s.exec(c.trim()))
		.map(m => ({ hash: m?.[1] ?? '', message: m?.[2].trim() ?? '' }))
)

export const calculateNextVersion = (commits: Commit[], curVersion: string): string => {
	const releaseType = commits.some(c => c.message.includes('BREAKING CHANGE'))
		? curVersion.startsWith('0.') ? 'minor' : 'major'
		: commits.some(c => /feat(\(.*?\))?:/.test(c.message)) ? 'minor' : 'patch'

	return semver.inc(curVersion, releaseType) ?? (() => {
		throw new Error(`Failed to increment version '${curVersion}' with release type '${releaseType}'`)
	})()
}

export const promptToContinue = async (): Promise<boolean> => {
	const rl = createInterface({ input: process.stdin, output: process.stdout })
	return await new Promise<boolean>(resolve => {
		rl.question('Press Enter to continue (\'s\' to skip): ', answer => {
			rl.close()
			resolve(answer.trim() !== 's')
		})
	})
}