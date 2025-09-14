import { parseVersion, determineNextVersion, getVersionTags, getRepoInfo, parseCommits, parseCommit } from '@/utils'
import type { UserConfig, ResolvedConfig, TransformedConfig, VersionedFile, MergedConfig, ResolvedContext, FalseOrComplete, ContextualConfig, ParsedCommit, ReleaseWithFlatCommits, ReleaseWithTypeGroups, TypeGroupsMap, ResolvedCommit, FilledTypeGroupMap } from '@/types'
import { defaultConfig, defaultVersionedFiles, defaultChangelogOptions, defaultCommitOptions, defaultTagOptions } from '@/defaults'
import Handlebars from 'handlebars'

export const resolveConfig = async (userConfig: UserConfig): Promise<ResolvedConfig> => {
	const profileMergedConfig = mergeProfileConfig(userConfig)
	const mergedConfig = mergeWithDefaults(profileMergedConfig)
	const transformedConfig = transformVersionedFiles(mergedConfig)
	const contextualConfig = await fillContext(transformedConfig)
	const finalConfig = resolveTemplates(contextualConfig)
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
			if (isBasePlainObject && isOverridePlainObject) {
				return { ...baseObj, ...overrideObject }
			} else if (!isBasePlainObject && isOverridePlainObject) {
				return overrideObject
			} else if (isBasePlainObject && !isOverridePlainObject) {
				return baseObj
			}
		}

		const baseConfigProp = baseConfig[propKey] as PlainObject | undefined
		const profileConfigProp = profileConfig[propKey] as PlainObject | undefined
		const result = mergeObjects(baseConfigProp, profileConfigProp) as PlainObject | undefined
		if (result === undefined) return undefined

		nestedPropKeys.forEach((key) => {
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
	}
}

const transformVersionedFiles = (config: MergedConfig): TransformedConfig => {
	const resolveVersionedFile = (filePath: string): VersionedFile => {
		const matchingDefaultVersionFile = defaultVersionedFiles.find(defaultFile =>
			defaultFile.filePathRegex.test(filePath))
		if (matchingDefaultVersionFile) {
			return { filePath, versionPattern: matchingDefaultVersionFile.versionPattern }
		} else {
			throw new Error(
				`File ${filePath} doesn't match any default versioned files. `
				+ 'Please provide a custom version pattern for this file.',
			)
		}
	}

	const resolveBump = (bump: MergedConfig['bump']): false | VersionedFile[] => {
		if (bump === false) return false
		if (bump === true) return [versionSourceFile]
		if (Array.isArray(bump)) return [
			versionSourceFile,
			...(bump.map(bumpFile =>
				typeof bumpFile === 'string' ? resolveVersionedFile(bumpFile) : bumpFile,
			)),
		]
		throw new Error('Invalid value for bump. It should be a boolean or an array.')
	}

	const versionSourceFile = typeof config.versionSourceFile === 'string'
		? resolveVersionedFile(config.versionSourceFile)
		: config.versionSourceFile

	return {
		...config,
		versionSourceFile,
		bump: resolveBump(config.bump),
		changelog: config.changelog === false
			? false
			: { ...config.changelog,
				compiledPartials: Object.fromEntries(Object.entries(config.changelog.partials).map(([key, template]) => [key, Handlebars.compile(template)])),
			},
	}
}

const fillContext = async (config: TransformedConfig): Promise<ContextualConfig> => {
	const resolvedContext = (config.context ?? {}) as Partial<ResolvedContext>

	const repoInfo = getRepoInfo(config.commitsParser.remoteUrlPattern)
	resolvedContext.repo = { ...repoInfo, ...resolvedContext.repo }

	const commitRange = config.changelog ? config.changelog.commitRange : 'unreleased'

	const parsedCommits = config.context?.commits
		? (await Promise.all(config.context.commits.map(async (commit) => {
			return ((typeof commit === 'object' && 'message' in commit) || typeof commit === 'string')
				? (await parseCommit(commit, config.commitsParser, config.prevReleaseTagPattern))
				: commit
		}))).filter(c => c != null)
		: await parseCommits(commitRange, config.commitsParser, config.prevReleaseTagPattern)

	resolvedContext.currentVersion ??= parseVersion(config.versionSourceFile)
	resolvedContext.currentTag ??= getVersionTags(config.prevReleaseTagPattern)[0]
	resolvedContext.newVersion ??= await determineNextVersion(config, resolvedContext.currentVersion)
	resolvedContext.newTag ??= compileTemplate(config.newTagFormat, resolvedContext as ResolvedContext)

	resolvedContext.commits = resolveCommits(parsedCommits, resolvedContext.newTag, config.commitsParser.revertCommitBodyPattern)

	const contextualConfig = { ...config, context: resolvedContext as ResolvedContext }

	resolvedContext.releases = config.changelog
		? groupCommitsByReleases(resolvedContext.commits, config.changelog.sections, contextualConfig)
		: null

	return contextualConfig
}

const resolveCommits = (commits: ParsedCommit[], newTag: string, revertCommitBodyPattern: RegExp): ResolvedCommit[] => {
	return commits.map((commit) => {
		let isRevertedStatus: ResolvedCommit['isReverted'] = null
		const revertCommit = commits.find(c => c.type === 'revert' && revertCommitBodyPattern.exec(c.body ?? '')?.groups?.hash === commit.hash)
		if (revertCommit) isRevertedStatus = revertCommit.associatedReleaseTag === commit.associatedReleaseTag ? 'inTheSameRelease' : 'inOtherRelease'
		return {
			...commit,
			associatedReleaseTag: commit.associatedReleaseTag ?? newTag,
			isReverted: commit.isReverted ?? isRevertedStatus,
		}
	})
}

const groupCommitsByReleases = (commits: ResolvedCommit[], sections: TypeGroupsMap, config: ContextualConfig): ReleaseWithTypeGroups[] => {
	const releases: Record<string, ReleaseWithFlatCommits> = {}

	commits.forEach((commit) => {
		const releaseTag = commit.associatedReleaseTag
		if (releaseTag in releases) {
			releases[releaseTag].commits.push(commit)
		} else {
			releases[releaseTag] = {
				tag: releaseTag,
				version: config.prevReleaseTagPattern.exec(releaseTag)?.groups?.version,
				date: commit.date,
				commits: [commit],
			}
		}
	})

	return Object.values(releases).map(release => groupReleaseCommitsBySections(release, sections)).filter(release => Object.keys(release.commitTypeGroups).length)
}

const groupReleaseCommitsBySections = (release: ReleaseWithFlatCommits, sections: TypeGroupsMap): ReleaseWithTypeGroups => {
	const { commits, ...releaseWithoutCommits } = release
	return {
		...releaseWithoutCommits,
		commitTypeGroups: groupCommitsByType(commits, sections),
	}
}

const groupCommitsByType = (commits: ResolvedCommit[], sections: TypeGroupsMap): FilledTypeGroupMap => {
	const filledTypeGroupsMap: FilledTypeGroupMap = Object.fromEntries(
		Object.entries(sections).map(([id, { filter: _, ...defWithoutFilter }]) => [id, { ...defWithoutFilter, commits: [] }]),
	)

	commits.forEach((commit) => {
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

	return Object.fromEntries(Object.entries(filledTypeGroupsMap).filter(([_, group]) => group.commits.length))
}

const resolveTemplates = (config: ContextualConfig): ResolvedConfig => {
	return {
		...config,
		commit: config.commit
			? { ...config.commit, message: compileTemplate(config.commit.message, config.context) }
			: config.commit,
		tag: config.tag
			? {
				...config.tag,
				name: compileTemplate(config.tag.name, config.context),
				message: compileTemplate(config.tag.message, config.context),
			}
			: config.tag,
	}
}

const compileTemplate = (value: string, context: ResolvedContext): string => {
	const compile = Handlebars.compile(value)
	return compile(context)
}