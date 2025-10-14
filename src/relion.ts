import { bump, commit, tag, changelog } from '@/lifecycle'
import { resolveConfig, setLogLevel } from '@/utils'
import type { UserConfig, RelionResult } from '@/types'

export default async function relion(userConfig: UserConfig): Promise<RelionResult> {
	setLogLevel((userConfig.logLevel ?? (!!userConfig.profile && userConfig[`_${userConfig.profile}`]?.logLevel)) || 'info')

	const resolvedConfig = resolveConfig(userConfig)
	let generatedChangelog, commitCommand, tagCommand

	for (const step of resolvedConfig.lifecycle) await {
		bump: () => bump(resolvedConfig),
		changelog: async () => generatedChangelog = await changelog(resolvedConfig),
		commit: () => commitCommand = commit(resolvedConfig),
		tag: () => tagCommand = tag(resolvedConfig),
	}[step]()

	return { resolvedConfig, generatedChangelog, commitCommand, tagCommand }
}