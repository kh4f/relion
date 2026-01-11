import { execSync } from 'node:child_process'
import semver from 'semver'
import type { Commit } from '@/types'

export const parseCommits = (curTag: string): Commit[] => (
	execSync(`git log ${curTag}.. --format="%h %B---"`, { encoding: 'utf8' }).trim()
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