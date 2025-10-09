import { execSync } from 'node:child_process'
import type { CommitRange, RawCommit, RepoInfo } from '@/types'
import { defaultConfig } from '@/defaults'

const commitLogFormat = `##COMMIT##%n#HASH# %h%n#MSG# %B%n#REFS# %d%n#AUTHOR-NAME# %an%n#AUTHOR-EMAIL# %ae%n#AUTHOR-DATE# %at%n#COMMITTER-NAME# %cn%n#COMMITTER-EMAIL# %ce%n#COMMITTER-DATE# %ct%n#GPGSIG-CODE# %G?%n#GPGSIG-KEYID# %GK%n`
const rawCommitPattern = /##COMMIT##\n#HASH# (?<hash>.+)?\n#MSG# (?<message>[\s\S]*?)\n#REFS#\s+(?<tagRefs>.+)?\n#AUTHOR-NAME# (?<authorName>.+)?\n#AUTHOR-EMAIL# (?<authorEmail>.+)?\n#AUTHOR-DATE# (?<authorTs>.+)?\n#COMMITTER-NAME# (?<committerName>.+)?\n#COMMITTER-EMAIL# (?<committerEmail>.+)?\n#COMMITTER-DATE# (?<committerTs>.+)?\n#GPGSIG-CODE# (?<gpgSigCode>.+)?\n#GPGSIG-KEYID# (?<gpgSigKeyId>.+)?/g

const releaseTagsCache = new Map<string, string[]>()

export const getRepoInfo = (remoteUrlPattern: RegExp): RepoInfo => {
	const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf8' }).trim()
	const remoteUrlMatch = remoteUrlPattern.exec(remoteUrl)
	if (!remoteUrlMatch?.groups) throw new Error(`Couldn't parse remote URL: ` + remoteUrl)

	const { host, owner, name } = remoteUrlMatch.groups
	const homepage = `https://${host}/${owner}/${name}`

	return { host, owner, name, homepage }
}

export const getRawCommits = (commitRange: CommitRange, prevReleaseTagPattern?: RegExp): RawCommit[] => {
	const firstCommitHash = getFirstCommitHash()
	const releaseTags = getReleaseTags(prevReleaseTagPattern)

	let from = '', to = '', range = ''
	if (commitRange === 'all') {
		from = '{{firstCommit}}'
		to = 'HEAD'
	} else if (commitRange === 'unreleased') {
		from = releaseTags[0] ?? '{{firstCommit}}'
		to = 'HEAD'
	} else if (commitRange === 'latest-release') {
		from = releaseTags[1] ?? '{{firstCommit}}'
		to = releaseTags[0] ?? 'HEAD'
	} else if (typeof commitRange === 'object') {
		const targetTagIndex = releaseTags.indexOf(commitRange.releaseTag)
		if (targetTagIndex === -1) throw new Error(`Release tag '${commitRange.releaseTag}' not found`)
		from = releaseTags[targetTagIndex + 1] ?? '{{firstCommit}}'
		to = releaseTags[targetTagIndex]
	} else {
		range = commitRange
	}

	if (from && to) range = from === '{{firstCommit}}' ? `"${from}^!" ${to}` : `"${from}..${to}"`

	range = range.replace('{{firstCommit}}', firstCommitHash)

	const gitLogCommits = execSync(`git log ${range} --pretty="${commitLogFormat}"`, { encoding: 'utf8' })
	return [...gitLogCommits.matchAll(rawCommitPattern)].map(m => m.groups as unknown as RawCommit)
}

const getFirstCommitHash = (): string => execSync('git rev-list --max-parents=0 HEAD', { encoding: 'utf8' }).trim()

export const getReleaseTags = (tagPattern?: RegExp): string[] => {
	tagPattern = tagPattern ?? defaultConfig.prevReleaseTagPattern
	const cacheKey = tagPattern.toString()
	if (releaseTagsCache.has(cacheKey)) return releaseTagsCache.get(cacheKey) ?? []

	const rawTags = execSync('git tag --sort=-creatordate', { encoding: 'utf8' })
	const tags = rawTags.split('\n').filter(tag => tagPattern.test(tag))
	releaseTagsCache.set(cacheKey, tags)
	return tags
}