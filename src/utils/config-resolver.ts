import { parseVersion, determineNextVersion, getVersionTags, getRepoInfo, parseCommits } from '@/utils'
import type { UserConfig, ResolvedConfig, TransformedConfig, VersionedFile, MergedConfig, ResolvedContext, FalseOrComplete, ContextualConfig, ResolvedChangelogSection, ChangelogSectionDefinition, Commit, ReleaseWithFlatCommits, ReleaseWithGroupedCommits } from '@/types'
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
			if (!isPlainObject(baseObj) || !isPlainObject(overrideObject)) return baseObj
			return { ...baseObj, ...overrideObject }
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

	resolvedContext.commits = config.context?.commits
		? await Promise.all(config.context.commits.map(async (commit) => {
			return ((typeof commit === 'object' && 'message' in commit) || typeof commit === 'string')
				? (await parseCommits([commit], config.commitsParser, config.prevReleaseTagPattern))[0]
				: commit
		}))
		: await parseCommits(commitRange, config.commitsParser, config.prevReleaseTagPattern)

	resolvedContext.currentVersion ??= parseVersion(config.versionSourceFile)
	resolvedContext.currentTag ??= getVersionTags(config.prevReleaseTagPattern)[0]
	resolvedContext.newVersion ??= await determineNextVersion(config, resolvedContext.currentVersion)
	resolvedContext.newTag ??= compileTemplate(config.newTagFormat, resolvedContext as ResolvedContext)

	const contextualConfig = { ...config, context: resolvedContext as ResolvedContext }

	resolvedContext.releases = config.changelog
		? groupCommitsByReleases(resolvedContext.commits, config.changelog.sections, contextualConfig)
		: null

	return contextualConfig
}

const groupCommitsByReleases = (commits: Commit[], sections: ChangelogSectionDefinition[], config: ContextualConfig): ReleaseWithGroupedCommits[] => {
	const releases: Record<string, ReleaseWithFlatCommits> = {}

	commits.forEach((commit) => {
		const releaseTag = commit.tags?.find(tag => config.prevReleaseTagPattern.test(tag))
		if (releaseTag) {
			releases[releaseTag] ??= {
				tag: releaseTag,
				version: config.prevReleaseTagPattern.exec(releaseTag)?.groups?.version,
				date: commit.date,
				commits: [commit],
			}
		} else {
			const latestReleaseTag = Object.keys(releases).at(-1)
			if (latestReleaseTag) {
				releases[latestReleaseTag].commits.push(commit)
			} else {
				releases[config.context.newTag] = {
					tag: config.context.newTag,
					version: config.context.newVersion,
					date: commit.date,
					commits: [commit],
				}
			}
		}
	})

	return Object.values(releases).map(release => groupReleaseCommitsBySections(release, sections))
}

const groupReleaseCommitsBySections = (release: ReleaseWithFlatCommits, sections: ChangelogSectionDefinition[]): ReleaseWithGroupedCommits => {
	const { commits, ...releaseWithoutCommits } = release
	return {
		...releaseWithoutCommits,
		commitGroups: groupCommitsBySections(commits, sections),
	}
}

const groupCommitsBySections = (commits: Commit[], sections: ChangelogSectionDefinition[]): ResolvedChangelogSection[] => {
	const commitGroups: Record<string, Commit[]> = Object.fromEntries(sections.map(section => [section.title, []]))

	commits.forEach((commit) => {
		const isBreaking = !!commit.breakingChanges
		let isGrouped = false
		let isBreakingGrouped = false

		for (const section of sections) {
			if (section.filter && !section.filter(commit)) continue

			const sectionTypes = [section.commitType].flat()

			if (isBreaking && !isBreakingGrouped && sectionTypes.includes('breaking')) {
				commitGroups[section.title].push(commit)
				isBreakingGrouped = true
				continue
			}

			if (!isGrouped && (sectionTypes.includes(commit.type) || sectionTypes.includes('*'))) {
				commitGroups[section.title].push(commit)
				isGrouped = true
			}

			if (isGrouped && (!isBreaking || isBreakingGrouped)) return
		}
	})

	Object.keys(commitGroups).forEach((key) => {
		if (!commitGroups[key].length) delete commitGroups[key]
	})

	return Object.entries(commitGroups).map(([title, commits]) => ({ title, commits }))
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