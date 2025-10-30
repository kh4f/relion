import { mergeConfigWithDefaults, parseVersion, determineNextVersion, getReleaseTags, getRepoInfo, parseCommits, parseCommit, extractVersionFromTag, resolvePartials, log } from '@/utils'
import type { UserConfig, ResolvedConfig, TransformedConfig, Bumper, MergedConfig, ParsedCommit, ReleaseWithFlatCommits, ReleaseWithTypeGroups, TypeGroupsMap, ResolvedCommit, FilledTypeGroupMap, ScopeGroup } from '@/types'
import { defaultBumpers, DEFAULT_RELEASE_TAG_PATTERN } from '@/defaults'
import Handlebars from 'handlebars'
import { readFileSync } from 'node:fs'

export const resolveConfig = (userConfig: UserConfig): ResolvedConfig => {
	const profiledConfig = mergeProfileConfig(userConfig)
	const mergedConfig = mergeConfigWithDefaults(profiledConfig)
	const transformedConfig = transformConfig(mergedConfig)
	const resolvedConfig = resolveContext(transformedConfig)
	return resolveTemplates(resolvedConfig)
}

const mergeProfileConfig = (baseConfig: UserConfig): UserConfig => {
	const profileName = baseConfig.profile ?? 'default'
	const profileConfig = baseConfig[`_${profileName}`]
	if (!profileConfig) {
		if (baseConfig.profile === undefined) return baseConfig
		else throw new Error(`Profile "${profileName}" not found in configuration.`)
	}

	const mergeOption = <T extends keyof UserConfig>(propKey: T, ...nestedPropKeys: string[]): UserConfig[T] => {
		type PlainObject = Record<string, unknown>

		const isPlainObject = (value: unknown): value is PlainObject =>
			Object.prototype.toString.call(value) === '[object Object]'

		const mergeObjects = (baseObj: unknown, overrideObject: unknown): unknown => {
			const isBasePlainObject = isPlainObject(baseObj)
			const isOverridePlainObject = isPlainObject(overrideObject)
			if (isBasePlainObject && isOverridePlainObject) return { ...baseObj, ...overrideObject }
			return overrideObject ?? baseObj
		}

		const baseConfigProp = baseConfig[propKey] as PlainObject | undefined
		const profileConfigProp = profileConfig[propKey] as PlainObject | undefined
		const result = mergeObjects(baseConfigProp, profileConfigProp) as PlainObject | undefined
		if (result === undefined) return undefined

		nestedPropKeys.forEach(key => {
			result[key] = mergeObjects(baseConfigProp?.[key], profileConfigProp?.[key])
		})

		return result as UserConfig[T]
	}

	return {
		...baseConfig, ...profileConfig,
		commitsParser: mergeOption('commitsParser'),
		changelog: mergeOption('changelog', 'partials', 'helpers'),
		commit: mergeOption('commit'),
		tag: mergeOption('tag'),
		context: mergeOption('context'),
	}
}

const transformConfig = (config: MergedConfig): TransformedConfig => {
	const resolveBumper = (bumper: string | Bumper): Bumper => {
		if (typeof bumper === 'object') return bumper
		const matchingDefaultVersionFile = defaultBumpers.find(defaultFile =>
			defaultFile.file.test(bumper))
		if (matchingDefaultVersionFile) {
			return { ...matchingDefaultVersionFile, file: bumper }
		} else {
			throw new Error(
				`File ${bumper} doesn't match any default versioned files. `
				+ 'Please provide a custom pattern for this file.',
			)
		}
	}

	const manifestFile = resolveBumper(config.manifestFile)
	const releasePattern = config.changelog?.releasePattern
	const tagMessage = config.tag?.message
	const prevReleaseTagPattern = config.prevReleaseTagPattern === '{{newTagFormat}}'
		? config.tagPrefix !== undefined
			? new RegExp(`${config.tagPrefix}${DEFAULT_RELEASE_TAG_PATTERN.source}`)
			: new RegExp(config.tagFormat.replace('{{version}}', DEFAULT_RELEASE_TAG_PATTERN.source))
		: config.prevReleaseTagPattern

	return {
		...config,
		manifestFile,
		bump: config.lifecycle.includes('bump') ? (config.bump ? config.bump.map(resolveBumper) : [manifestFile]) : undefined,
		changelog: config.changelog ? {
			...config.changelog, compiledPartials: resolvePartials(config.changelog, config.context),
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			latestReleasePattern: new RegExp(releasePattern!.source.replace('{{version}}', ''), releasePattern!.flags),
		} : undefined,
		tag: config.tag ? {
			...config.tag,
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			message: tagMessage === '{{commitMessage}}' ? (config.commit?.message ?? tagMessage) : tagMessage!,
		} : undefined,
		prevReleaseTagPattern,
	}
}

const resolveContext = (config: TransformedConfig): ResolvedConfig => {
	const oldContext = config.context

	const repoInfo = getRepoInfo(config.commitsParser.remoteUrlPattern)
	const packageInfo = config.manifestFile.pattern.exec(readFileSync(config.manifestFile.file, 'utf-8'))?.groups
	const currentVersion = oldContext.currentVersion ?? (
		config.versionSource === 'latest-release-tag'
			? extractVersionFromTag(getReleaseTags(config.prevReleaseTagPattern)[0], config.prevReleaseTagPattern) ?? '0.0.0'
			: parseVersion(config.manifestFile)
	)
	log(`Current version (from ${config.versionSource === 'latest-release-tag' ? 'latest release tag' : `'${config.manifestFile.file}'`}): '${currentVersion}'`)
	const currentTag = oldContext.currentTag ?? getReleaseTags(config.prevReleaseTagPattern)[0]
	const newVersion = oldContext.newVersion ?? determineNextVersion(config, currentVersion, config.commitsScope)
	const newTag = oldContext.newTag ?? (config.tagPrefix !== undefined
		? config.tagPrefix + newVersion
		: config.tagFormat.replace('{{version}}', newVersion))

	const commitRange = config.changelog ? config.changelog.commitRange : 'unreleased'
	const parsedCommits = oldContext.commits
		? oldContext.commits.map(commit => {
			return ((typeof commit === 'object' && 'message' in commit) || typeof commit === 'string')
				? parseCommit(commit, config.commitsParser, config.prevReleaseTagPattern)
				: commit
		}).filter(c => c != null)
		: parseCommits(commitRange, config.commitsParser, config.prevReleaseTagPattern, config.commitsScope)

	const resolvedCommits = resolveCommits(parsedCommits, newTag, config.commitsParser.revertCommitBodyPattern)
	const releases = config.changelog ? groupCommitsByReleases(resolvedCommits, config.changelog.sections, config.prevReleaseTagPattern, config.changelog.groupCommitsByScope) : null
	const { commits: _, ...noCommitsOldContext } = oldContext

	return {
		...config,
		context: {
			currentVersion,
			currentTag,
			newVersion,
			newTag,
			commits: resolvedCommits,
			releases,
			commitRefLinks: oldContext.commitRefLinks ?? true,
			footerChangelogUrl: oldContext.footerChangelogUrl ?? false,
			...noCommitsOldContext,
			repo: {
				...repoInfo,
				...config.context.repo,
			},
			package: {
				...packageInfo,
				...config.context.package,
			},
		},
	}
}

const resolveCommits = (commits: ParsedCommit[], newTag: string, revertCommitBodyPattern: RegExp): ResolvedCommit[] => {
	let breakingChangesIndex = 0
	const omittedRevertCommitsIdxs: number[] = []
	return commits.map((commit): ResolvedCommit | undefined => {
		let isRevertedStatus: ResolvedCommit['isReverted'] = null
		const revertCommitIdx = commits.findIndex(c => c.type === 'revert' && revertCommitBodyPattern.exec(c.body ?? '')?.groups?.hash === commit.hash)
		const revertCommit = revertCommitIdx !== -1 ? commits[revertCommitIdx] : undefined
		if (revertCommit) isRevertedStatus = revertCommit.associatedReleaseTag === commit.associatedReleaseTag ? 'inTheSameRelease' : 'inOtherRelease'
		if (isRevertedStatus === 'inTheSameRelease') {
			omittedRevertCommitsIdxs.push(revertCommitIdx)
			return
		}
		return {
			...commit,
			associatedReleaseTag: commit.associatedReleaseTag ?? newTag,
			isReverted: commit.isReverted ?? isRevertedStatus,
			breakingChangeIndex: commit.breakingChanges ? ++breakingChangesIndex : undefined,
		}
	}).filter((commit, idx): commit is ResolvedCommit => !!commit && !omittedRevertCommitsIdxs.includes(idx))
}

const groupCommitsByReleases = (commits: ResolvedCommit[], sections: TypeGroupsMap, prevReleaseTagPattern: RegExp, withScopeGroups?: boolean): ReleaseWithTypeGroups[] => {
	const releases: Record<string, ReleaseWithFlatCommits> = {}

	commits.forEach(commit => {
		const releaseTag = commit.associatedReleaseTag
		if (releaseTag in releases) {
			releases[releaseTag].commits.push(commit)
		} else {
			releases[releaseTag] = {
				tag: releaseTag,
				version: extractVersionFromTag(releaseTag, prevReleaseTagPattern),
				date: commit.date,
				commits: [commit],
			}
		}
	})

	return Object.values(releases)
		.map(({ commits, ...rest }) => {
			const commitTypeGroups = groupCommitsByType(commits, sections, withScopeGroups)
			if (Object.keys(commitTypeGroups).length === 0) return

			const limitedGroups: FilledTypeGroupMap = {}
			for (const [sectionId, group] of Object.entries(commitTypeGroups)) {
				if (group.show === 'never') continue
				else if (group.show === 'only-breaking') {
					group.commits = group.commits.filter(c => !!c.breakingChanges)
					if (group.commits.length) {
						group.scopeGroups = groupCommitsByScope(group.commits)
						limitedGroups[sectionId] = group
					}
				} else {
					limitedGroups[sectionId] = group
				}
			}
			return { ...rest, commitTypeGroups: limitedGroups }
		})
		.filter((release): release is ReleaseWithTypeGroups => !!release)
}

const groupCommitsByType = (commits: ResolvedCommit[], sections: TypeGroupsMap, withScopeGroups?: boolean): FilledTypeGroupMap => {
	const filledTypeGroupsMap: FilledTypeGroupMap = Object.fromEntries(
		Object.entries(sections).map(([id, { filter: _, ...defWithoutFilter }]) => [id, { ...defWithoutFilter, commits: [] }]),
	)

	commits.forEach(commit => {
		const isBreaking = !!commit.breakingChanges
		let isGrouped = false
		let isBreakingGrouped = false

		for (const sectionId in sections) {
			if (sections[sectionId].filter && !sections[sectionId].filter(commit)) continue

			const sectionTypes = [sections[sectionId].commitType].flat()

			if (isBreaking && !isBreakingGrouped && sectionTypes.includes('breaking')) {
				filledTypeGroupsMap[sectionId].commits.push(commit)
				isBreakingGrouped = true
				continue
			}

			if (!isGrouped && (sectionTypes.includes(commit.type) || sectionTypes.includes('*'))) {
				filledTypeGroupsMap[sectionId].commits.push(commit)
				isGrouped = true
			}

			if (isGrouped && (!isBreaking || isBreakingGrouped)) return
		}
	})

	const typeGroupsEntries = Object.entries(filledTypeGroupsMap).filter(([_, group]) => group.commits.length)
	return Object.fromEntries(
		withScopeGroups
			? typeGroupsEntries.map(([type, group]) => [type, { ...group, scopeGroups: groupCommitsByScope(group.commits) }])
			: typeGroupsEntries,
	)
}

const groupCommitsByScope = (commits: ResolvedCommit[]): ScopeGroup[] => {
	const groups: Record<string, ResolvedCommit[]> = {}
	commits.forEach(commit => {
		const scope = commit.scope ?? ''
		groups[scope] ??= []
		groups[scope].push(commit)
	})
	return Object.entries(groups).map(([scope, commits]) => ({ scope, commits }))
}

const resolveTemplates = (config: ResolvedConfig): ResolvedConfig => {
	return {
		...config,
		commit: config.commit
			? { ...config.commit, message: Handlebars.compile(config.commit.message)(config.context) }
			: config.commit,
		tag: config.tag
			? {
				...config.tag,
				name: Handlebars.compile(config.tag.name)(config.context),
				message: Handlebars.compile(config.tag.message)(config.context),
			}
			: config.tag,
	}
}