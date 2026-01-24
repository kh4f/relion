import { execSync } from 'node:child_process'
import { createInterface } from 'node:readline'
import semver from 'semver'
import type { Commit, Config } from '@/types'

export const parseCommits = (curTag: string): Commit[] => (
	execSync(`git log ${curTag ? `${curTag}..` : ''} --format="%h %B---" .`, { encoding: 'utf8' }).trim()
		.split('---').filter(Boolean)
		.map(c => /^(.+?) (.+)/s.exec(c.trim()))
		.map(m => ({ hash: m?.[1] ?? '', message: m?.[2].trim() ?? '' }))
)

export const filterCommits = (commits: Commit[], filters: Config['commitFilters'] = []): Commit[] => (
	commits.filter(c => (
		filters.some(filter => filter instanceof RegExp
			? filter.test(c.message)
			: strToRegex(filter).test(c.message),
		)
	))
)

export const calculateNextVersion = (commits: Commit[], curVersion: string): string => {
	const releaseType = commits.some(c => c.message.includes('BREAKING CHANGE'))
		? curVersion.startsWith('0.') ? 'minor' : 'major'
		: commits.some(c => /feat(\(.*?\))?:/.test(c.message)) ? 'minor' : 'patch'

	return semver.inc(curVersion, releaseType) ?? (() => {
		throw new Error(`Failed to increment version '${curVersion}' with release type '${releaseType}'`)
	})()
}

export const promptToContinue = async (): Promise<void> => {
	const rl = createInterface({ input: process.stdin, output: process.stdout })
	await new Promise<void>(resolve => {
		rl.question('Press Enter to continue...', () => {
			rl.close()
			resolve()
		})
	})
}

export const strToRegex = (str: string): RegExp => {
	const match = /^\/(.+)\/(\w*)$/.exec(str)
	return match ? new RegExp(match[1], match[2]) : new RegExp(str)
}