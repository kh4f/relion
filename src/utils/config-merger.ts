import type { MergedConfig, UserConfig } from '@/types'
import { defaultConfig, defaultChangelogOptions, defaultCommitOptions, defaultTagOptions } from '@/defaults'

export const mergeConfigWithDefaults = (config: UserConfig): MergedConfig => {
	let lifecycle = config.lifecycle ?? defaultConfig.lifecycle
	if (lifecycle === 'all') lifecycle = ['bump', 'changelog', 'commit', 'tag']
	else lifecycle = [...new Set(lifecycle)]

	return {
		...defaultConfig, ...config,
		lifecycle,
		commitsParser: { ...defaultConfig.commitsParser, ...config.commitsParser },
		bump: lifecycle.includes('bump') ? (config.bump ?? defaultConfig.bump) : undefined,
		changelog: lifecycle.includes('changelog')
			? { ...defaultChangelogOptions, ...config.changelog,
				partials: { ...defaultChangelogOptions.partials, ...config.changelog?.partials },
				helpers: { ...defaultChangelogOptions.helpers, ...config.changelog?.helpers },
			}
			: undefined,
		commit: lifecycle.includes('commit') ? { ...defaultCommitOptions, ...config.commit } : undefined,
		tag: lifecycle.includes('tag') ? { ...defaultTagOptions, ...config.tag } : undefined,
		context: { ...defaultConfig.context, ...config.context },
	}
}

const mergeConfigsWithoutProfiles = (baseConfig: UserConfig, overrideConfig: UserConfig): UserConfig => ({
	...baseConfig,
	...overrideConfig,
	commitsParser: { ...baseConfig.commitsParser, ...overrideConfig.commitsParser },
	changelog: {
		...baseConfig.changelog,
		...overrideConfig.changelog,
		partials: { ...baseConfig.changelog?.partials, ...overrideConfig.changelog?.partials },
		helpers: { ...baseConfig.changelog?.helpers, ...overrideConfig.changelog?.helpers },
	},
	commit: { ...baseConfig.commit, ...overrideConfig.commit },
	tag: { ...baseConfig.tag, ...overrideConfig.tag },
	context: { ...baseConfig.context, ...overrideConfig.context },
})

export const mergeConfigs = (baseConfig: UserConfig, overrideConfig: UserConfig): UserConfig => {
	const result = mergeConfigsWithoutProfiles(baseConfig, overrideConfig)
	for (const key of Object.keys(baseConfig)) {
		if (key.startsWith('_')) {
			const profileKey = key as `_${string}`
			result[profileKey] = mergeConfigsWithoutProfiles(baseConfig[profileKey] ?? {}, overrideConfig[profileKey] ?? {})
		}
	}
	return result
}