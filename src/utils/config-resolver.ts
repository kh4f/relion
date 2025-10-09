import { parseVersion, determineNextVersion, getReleaseTags, getRepoInfo, parseCommits, parseCommit, extractVersionFromTag, compilePartials, log } from '@/utils'
import type { UserConfig, ResolvedConfig, TransformedConfig, Bumper, MergedConfig, FalseOrComplete, ParsedCommit, ReleaseWithFlatCommits, ReleaseWithTypeGroups, TypeGroupsMap, ResolvedCommit, FilledTypeGroupMap, ScopeGroup } from '@/types'
import { defaultConfig, defaultBumpers, defaultChangelogOptions, defaultCommitOptions, defaultTagOptions } from '@/defaults'
import Handlebars from 'handlebars'

export const resolveConfig = (userConfig: UserConfig): ResolvedConfig => {
	const profileMergedConfig = mergeProfileConfig(userConfig)
	const mergedConfig = mergeWithDefaults(profileMergedConfig)
	const transformedConfig = transformConfig(mergedConfig)
	const ResolvedConfig = resolveContext(transformedConfig)
	const finalConfig = resolveTemplates(ResolvedConfig)
	return finalConfig
}

const mergeProfileConfig = (baseConfig: UserConfig): UserConfig => {
	const profileName = baseConfig.profile
	if (!profileName) return baseConfig

	const profileConfig = baseConfig[`_${profileName}`]
	if (!profileConfig) throw new Error(`Profile "${profileName}" not found in configuration.`)

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

const mergeWithDefaults = (userConfig: UserConfig): MergedConfig => {
	const resolveOptions = <T>(optionsName: string, options: boolean | T | undefined, defaults: Required<T>, ...subObjects: (keyof T)[]): FalseOrComplete<T> => {
		if (options == undefined || options === false) return false
		if (options === true) return defaults
		if (typeof options !== 'object') throw new Error(`Invalid value for ${optionsName}. It should be a boolean or an object.`)
		const result: Required<T> = { ...defaults, ...options }
		subObjects.forEach(subObjectKey => result[subObjectKey] = { ...defaults[subObjectKey], ...options[subObjectKey] })
		return result
	}

	return {
		...defaultConfig, ...userConfig,
		commitsParser: { ...defaultConfig.commitsParser, ...userConfig.commitsParser },
		changelog: resolveOptions('changelog', userConfig.changelog, defaultChangelogOptions, 'partials', 'helpers'),
		commit: resolveOptions('commit', userConfig.commit, defaultCommitOptions),
		tag: resolveOptions('tag', userConfig.tag, defaultTagOptions),
		context: { ...defaultConfig.context, ...userConfig.context },
	}
}

const transformConfig = (config: MergedConfig): TransformedConfig => {
	const resolveBumper = (file: string): Bumper => {
		const matchingDefaultVersionFile = defaultBumpers.find(defaultFile =>
			defaultFile.file.test(file))
		if (matchingDefaultVersionFile) {
			return { ...matchingDefaultVersionFile, file }
		} else {
			throw new Error(
				`File ${file} doesn't match any default versioned files. `
				+ 'Please provide a custom pattern for this file.',
			)
		}
	}

	const resolveBump = (bump: MergedConfig['bump']): false | Bumper[] => {
		if (bump === false) return false
		if (bump === true) return [versionSourceFile]
		if (Array.isArray(bump)) return bump.map(bumpFile => typeof bumpFile === 'string' ? resolveBumper(bumpFile) : bumpFile)
		throw new Error('Invalid value for bump. It should be a boolean or an array.')
	}

	const versionSourceFile = typeof config.versionSourceFile === 'string'
		? resolveBumper(config.versionSourceFile)
		: config.versionSourceFile

	return {
		...config,
		versionSourceFile,
		bump: resolveBump(config.bump),
		changelog: config.changelog === false
			? false
			: { ...config.changelog, compiledPartials: compilePartials(config.changelog.partials) },
	}
}

const resolveContext = (config: TransformedConfig): ResolvedConfig => {
	const oldContext = config.context ?? {}

	const repoInfo = getRepoInfo(config.commitsParser.remoteUrlPattern)
	const currentVersion = oldContext.currentVersion ?? (
		config.versionSource === 'latest-release-tag'
			? extractVersionFromTag(getReleaseTags(config.prevReleaseTagPattern)[0], config.prevReleaseTagPattern) ?? '0.0.0'
			: parseVersion(config.versionSourceFile)
	)
	log(`Current version (from ${config.versionSource === 'latest-release-tag' ? 'latest release tag' : `'${config.versionSourceFile.file}'`}): '${currentVersion}'`)
	const currentTag = oldContext.currentTag ?? getReleaseTags(config.prevReleaseTagPattern)[0]
	const newVersion = oldContext.newVersion ?? determineNextVersion(config, currentVersion)
	const newTag = oldContext.newTag ?? (config.newTagPrefix !== undefined
		? config.newTagPrefix + newVersion
		: config.newTagFormat.replace('{{version}}', newVersion))

	const commitRange = config.changelog ? config.changelog.commitRange : 'unreleased'
	const commitsScope = config.changelog ? config.changelog.commitsScope : undefined
	const parsedCommits = oldContext.commits
		? oldContext.commits.map(commit => {
			return ((typeof commit === 'object' && 'message' in commit) || typeof commit === 'string')
				? parseCommit(commit, config.commitsParser, config.prevReleaseTagPattern)
				: commit
		}).filter(c => c != null)
		: parseCommits(commitRange, config.commitsParser, config.prevReleaseTagPattern, commitsScope)

	const resolvedCommits = resolveCommits(parsedCommits, newTag, config.commitsParser.revertCommitBodyPattern)
	const releases = config.changelog ? groupCommitsByReleases(resolvedCommits, config.changelog.sections, config.prevReleaseTagPattern, config.changelog.groupCommitsByScope, config.changelog.maxLinesPerRelease) : null
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
			...noCommitsOldContext,
			repo: {
				...repoInfo,
				...config.context?.repo,
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

const groupCommitsByReleases = (commits: ResolvedCommit[], sections: TypeGroupsMap, prevReleaseTagPattern: RegExp, withScopeGroups?: boolean, maxLinesPerRelease?: number): ReleaseWithTypeGroups[] => {
	maxLinesPerRelease = maxLinesPerRelease ?? defaultChangelogOptions.maxLinesPerRelease
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

			let totalCommits = 0
			let limitIsReached = false
			const limitedGroups: FilledTypeGroupMap = {}
			for (const [sectionId, group] of Object.entries(commitTypeGroups)) {
				group.show ??= 'limit-or-breaking'
				if ((totalCommits + group.commits.length > maxLinesPerRelease) && Object.keys(limitedGroups).length) limitIsReached = true
				if (group.show === 'never') continue
				if (group.show === 'only-breaking' || (group.show === 'limit-or-breaking' && limitIsReached)) {
					group.commits = group.commits.filter(c => !!c.breakingChanges)
					if (group.commits.length) {
						group.scopeGroups = groupCommitsByScope(group.commits)
						limitedGroups[sectionId] = group
						totalCommits += group.commits.length
					}
				} else if (group.show === 'always' || !limitIsReached) {
					limitedGroups[sectionId] = group
					totalCommits += group.commits.length
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