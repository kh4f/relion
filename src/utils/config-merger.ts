import type { MergedConfig, UserConfig } from '@/types'
import { defaultConfig, defaultChangelogOptions, defaultCommitOptions, defaultTagOptions } from '@/defaults'

export const mergeWithDefaults = (config: UserConfig): MergedConfig => {
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