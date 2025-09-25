import type { CompleteCommitsParser, ParsedCommit, RawCommit, RawReference, RefLabel, Reference, Contributor, CommitMessage, CommitRange } from '@/types'
import { GpgSigLabel } from '@/enums'
import { getRawCommits } from '@/utils'
import { createHash } from 'node:crypto'

const parsedCommitsCache: Record<string, ParsedCommit> = {}
let recentReleaseTag: ParsedCommit['releaseTag']

export const parseCommits = (arg1: CommitRange | RawCommit[], commitsParser: CompleteCommitsParser, prevReleaseTagPattern: RegExp): ParsedCommit[] => {
	const rawCommits = Array.isArray(arg1) ? arg1 : getRawCommits(arg1, prevReleaseTagPattern)
	const parser = commitsParser

	const parsedCommits = rawCommits.map(commit => parseCommit(commit, parser, prevReleaseTagPattern))
		.filter(commit => commit !== null)

	recentReleaseTag = undefined

	return parsedCommits
}

export const parseCommit = (commit: RawCommit, parser: CompleteCommitsParser, prevReleaseTagPattern: RegExp): ParsedCommit | null => {
	if (typeof commit === 'string') commit = { message: commit }

	const { tagRefs, hash = getFakeCommitHash(commit.message) } = commit

	if (hash in parsedCommitsCache) return parsedCommitsCache[hash]

	const message = commit.message.trim()
	if (!message) throw new Error(`Message is missing for commit: ${JSON.stringify(commit)}`)

	let parsedMessage
	try {
		parsedMessage = parseCommitMessage(message, parser)
	} catch (error) {
		console.warn(`Error parsing commit '${hash}':`, (error as Error).message)
		return null
	}
	const { type, scope, subject, body, breakingChanges, footer } = parsedMessage
	const tags = tagRefs ? [...tagRefs.matchAll(parser.tagPattern)].map(m => m.groups?.tag ?? '') : []

	const signers = footer
		? [...footer.matchAll(parser.signerPattern)].map(m => m.groups as unknown as Contributor)
		: []

	const authors: Contributor[] = []
	const addAuthor = (contributor: Contributor): void => {
		if (!authors.some(a => a.email === contributor.email)) authors.push(contributor)
	}

	const author = commit.authorName && commit.authorEmail
		? getContributorDetails({ name: commit.authorName, email: commit.authorEmail }, signers)
		: undefined
	if (author) addAuthor(author)

	const committer = commit.committerName && commit.committerEmail
		? getContributorDetails({ name: commit.committerName, email: commit.committerEmail }, signers)
		: undefined
	if (committer) addAuthor(committer)

	const coAuthors = footer
		? [...footer.matchAll(parser.coAuthorPattern)].map(m => m.groups as unknown as Contributor)
			.map(coAuthor => getContributorDetails(coAuthor, signers))
		: []
	coAuthors.forEach(coAuthor => addAuthor(coAuthor))

	const refs = parseRefs((footer ?? ''), parser)

	const gpgSig = commit.gpgSigCode
		? {
			code: commit.gpgSigCode,
			label: GpgSigLabel[commit.gpgSigCode],
			keyId: commit.gpgSigKeyId,
		}
		: undefined

	let date = commit[parser.dateSource === 'committerDate' ? 'committerTs' : 'authorTs']
	if (typeof date === 'string') date = formatDate(new Date(+date * 1000), parser.dateFormat)

	const releaseTag = tags.find(tag => prevReleaseTagPattern.exec(tag))

	const associatedReleaseTag = releaseTag ?? recentReleaseTag
	if (associatedReleaseTag) recentReleaseTag = associatedReleaseTag

	const parsedCommit = { hash, type, scope, subject, body, breakingChanges, footer, committer, gpgSig, date, releaseTag, associatedReleaseTag,
		tags: tags.length ? tags : undefined,
		authors: authors.length ? authors : undefined,
		refs: refs.length ? refs : undefined,
	}

	if (hash && !(hash in parsedCommitsCache)) parsedCommitsCache[hash] = parsedCommit

	return parsedCommit
}

const getFakeCommitHash = (message: string): string =>
	'fake_' + createHash('sha256').update(message, 'utf8').digest('hex').slice(0, 7)

const parseCommitMessage = (message: string, parser: CompleteCommitsParser): CommitMessage => {
	const [header, ...details] = message.split('\n\n')

	const headerMatch = parser.headerPattern.exec(header)
	if (!headerMatch?.groups) throw new Error(`Commit header '${header}' doesn't match expected format`)
	const { type, scope, bang, subject } = headerMatch.groups

	let breakingChanges
	const breakingChangesPart = details.find(detail => parser.breakingChangesPattern.test(detail))
	if (breakingChangesPart) {
		breakingChanges = parseBreakingChanges(breakingChangesPart, parser)
		details.splice(details.indexOf(breakingChangesPart), 1)
	} else if (bang) {
		breakingChanges = subject
	}

	const footerStart = details.findIndex(detail =>
		detail.match(parser.refActionPattern)
		?? detail.match(parser.coAuthorPattern)
		?? detail.match(parser.signerPattern))
	const [body, footer] = footerStart === -1
		? [details.join('\n\n'), '']
		: [details.slice(0, footerStart).join('\n\n'), details.slice(footerStart).join('\n\n')]

	return {
		type,
		scope: scope || undefined,
		subject,
		body: body || undefined,
		breakingChanges,
		footer: footer || undefined,
	}
}

const parseBreakingChanges = (value: string, parser: CompleteCommitsParser): ParsedCommit['breakingChanges'] => {
	const breakingChanges = parser.breakingChangesPattern.exec(value)?.groups?.content
	if (!breakingChanges) throw new Error(`Failed to extract breaking changes content from '${value}' using pattern "${parser.breakingChangesPattern}"`)

	const breakingChangeList = [...breakingChanges.matchAll(parser.breakingChangeListPattern)]

	return breakingChangeList.length
		? breakingChangeList.map(m => m[1])
		: breakingChanges
}

const getContributorDetails = (contributor: Contributor, signers: Contributor[]): Contributor => {
	const hasSignedOff = signers.some(signer => signer.email === contributor.email && signer.name === contributor.name)
	return {
		...contributor,
		hasSignedOff,
		ghLogin: contributor.name,
		ghUrl: `https://github.com/${contributor.name}`,
	}
}

const parseRefs = (value: string, parser: CompleteCommitsParser): Reference[] =>
	[...value.matchAll(parser.refPattern)].map(m => m.groups as unknown as RawReference)
		.filter(rawRef => parser.refActionPattern.test(rawRef.action))
		.flatMap(rawRef =>
			[...rawRef.labels.matchAll(parser.refLabelPattern)].map(m => m.groups as unknown as RefLabel)
				.filter(label => !!label.number)
				.map(label => ({
					action: rawRef.action,
					owner: label.owner,
					repo: label.repo,
					number: label.number,
				})),
		)

const formatDate = (date: Date, format: string): string => {
	const pad = (num: number) => num.toString().padStart(2, '0')

	if (format === 'US') {
		return date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
	} else if (format === 'ISO') {
		return date.toISOString().split('T')[0]
	}

	const dateParts: Record<string, string> = {
		YYYY: date.getUTCFullYear().toString(),
		MM: pad(date.getUTCMonth() + 1),
		DD: pad(date.getUTCDate()),
		HH: pad(date.getUTCHours()),
		mm: pad(date.getUTCMinutes()),
		ss: pad(date.getUTCSeconds()),
	}

	return format.replace(/YYYY|MM|DD|HH|mm|ss/g, k => dateParts[k])
}