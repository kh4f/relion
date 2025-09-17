import { bump, commit, tag, changelog } from '@/lifecycles'
import { resolveConfig, setSilent } from '@/utils'
import type { UserConfig } from '@/types'

export default async function relion(userConfig: UserConfig) {
	setSilent(!!userConfig.silent || (!!userConfig.profile && !!userConfig[`_${userConfig.profile}`]?.silent))

	const resolvedConfig = await resolveConfig(userConfig)

	const bumpResults = bump(resolvedConfig)
	const generatedChangelog = changelog(resolvedConfig)
	const commitCommand = commit(resolvedConfig)
	const tagCommand = tag(resolvedConfig)

	return { resolvedConfig, generatedChangelog, commitCommand, tagCommand, bumpResults }
}

export const defineConfig = (config: UserConfig): UserConfig => config