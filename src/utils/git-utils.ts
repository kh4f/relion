import { execSync } from 'node:child_process'
import type { CommitRange, RawCommit, RepoInfo } from '@/types'

const commitLogFormat = `##COMMIT##%n#HASH# %h%n#MSG# %B%n#REFS# %d%n#AUTHOR-NAME# %an%n#AUTHOR-EMAIL# %ae%n#AUTHOR-DATE# %at%n#COMMITTER-NAME# %cn%n#COMMITTER-EMAIL# %ce%n#COMMITTER-DATE# %ct%n#GPGSIG-CODE# %G?%n#GPGSIG-KEYID# %GK%n`
const rawCommitPattern = /##COMMIT##\n#HASH# (?<hash>.+)?\n#MSG# (?<message>[\s\S]*?)\n#REFS#\s+(?<tagRefs>.+)?\n#AUTHOR-NAME# (?<authorName>.+)?\n#AUTHOR-EMAIL# (?<authorEmail>.+)?\n#AUTHOR-DATE# (?<authorTs>.+)?\n#COMMITTER-NAME# (?<committerName>.+)?\n#COMMITTER-EMAIL# (?<committerEmail>.+)?\n#COMMITTER-DATE# (?<committerTs>.+)?\n#GPGSIG-CODE# (?<gpgSigCode>.+)?\n#GPGSIG-KEYID# (?<gpgSigKeyId>.+)?/g

export const getRepoInfo = (remoteUrlPattern: RegExp): RepoInfo => {
	const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf8' }).trim()
	const remoteUrlMatch = remoteUrlPattern.exec(remoteUrl)
	if (!remoteUrlMatch?.groups) throw new Error(`Couldn't parse remote URL: ` + remoteUrl)

	const { host, owner, name } = remoteUrlMatch.groups
	const homepage = `https://${host}/${owner}/${name}`

	return { host, owner, name, homepage }
}

export const getRawCommits = (commitRange: CommitRange, prevReleaseTagPattern: RegExp): RawCommit[] => {
	const firstCommitHash = getFirstCommitHash()
	const versionTags = getVersionTags(prevReleaseTagPattern)

	let from: string, to: string
	if (commitRange === 'all') {
		from = firstCommitHash
		to = 'HEAD'
	} else if (commitRange === 'unreleased') {
		from = versionTags[0] ?? firstCommitHash
		to = 'HEAD'
	} else if (commitRange === 'latest-release') {
		from = versionTags[1] ?? firstCommitHash
		to = versionTags[0] ? versionTags[0] + '^' : 'HEAD'
	} else if ('from' in commitRange || 'to' in commitRange) {
		const fromValue = 'from' in commitRange ? commitRange.from : 'firstCommit'
		from = fromValue === 'firstCommit' ? firstCommitHash : fromValue
		to = 'to' in commitRange ? commitRange.to : 'HEAD'
	} else if ('versionTag' in commitRange) {
		const targetTagIndex = versionTags.indexOf(commitRange.versionTag)
		if (targetTagIndex === -1) throw new Error(`Version tag '${commitRange.versionTag}' not found`)
		from = versionTags[targetTagIndex]
		to = versionTags[targetTagIndex + 1] ?? 'HEAD'
	} else {
		throw new Error(`Invalid commit range provided`)
	}

	const gitLogCommits = execSync(`git log ${from}..${to} --pretty="${commitLogFormat}"`, { encoding: 'utf8' })
	return [...gitLogCommits.matchAll(rawCommitPattern)].map(m => m.groups as RawCommit)
}

const getFirstCommitHash = (): string => execSync('git rev-list --max-parents=0 HEAD', { encoding: 'utf8' }).trim()

export const getVersionTags = (tagPattern: RegExp): string[] => {
	const rawTags = execSync('git tag --sort=-creatordate', { encoding: 'utf8' })
	return rawTags.split('\n').filter(tag => tagPattern.test(tag))
}