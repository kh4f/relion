import { bump, commit, tag, changelog } from '@/lifecycles'
import { resolveConfig, setSilent } from '@/utils'
import type { UserConfig } from '@/types'

export default async function relion(userConfig: UserConfig) {
	setSilent(!!userConfig.silent)
	const config = await resolveConfig(userConfig)
	bump(config)
	changelog(config)
	commit(config)
	tag(config)
}

export const defineConfig = (config: UserConfig): UserConfig => config