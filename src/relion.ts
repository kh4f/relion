import { bump, commit, tag, changelog } from '@/lifecycles'
import { resolveConfig, setLogLevel } from '@/utils'
import type { UserConfig, RelionResult } from '@/types'

export default function relion(userConfig: UserConfig): RelionResult {
	setLogLevel((userConfig.logLevel ?? (!!userConfig.profile && userConfig[`_${userConfig.profile}`]?.logLevel)) || 'info')

	const resolvedConfig = resolveConfig(userConfig)

	bump(resolvedConfig)
	const generatedChangelog = changelog(resolvedConfig)
	const commitCommand = commit(resolvedConfig)
	const tagCommand = tag(resolvedConfig)

	return { resolvedConfig, generatedChangelog, commitCommand, tagCommand }
}