import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import relion from './index.js'
import type { UserConfig, RelionResult, LifecycleStep } from '@/types'
import { cli } from 'cleye'

const loadConfigFile = async (configPath: string): Promise<UserConfig> => {
	try {
		const configFileURL = pathToFileURL(resolve(process.cwd(), configPath)).href
		return ((await import(configFileURL)) as { default: UserConfig }).default
	} catch (error) {
		throw new Error(`Error loading config: ${(error as Error).message}`)
	}
}

const parseLifecycleFlag = (flag: string): 'all' | LifecycleStep[] => {
	if (flag === 'all') return 'all'
	const stepsMap = { b: 'bump', l: 'changelog', m: 'commit', t: 'tag' } as const
	return flag.split('').map(char => {
		if (!(char in stepsMap)) throw new Error(`Invalid lifecycle step alias: '${char}'`)
		return stepsMap[char as keyof typeof stepsMap]
	})
}

if (import.meta.main) await runCli()

export async function runCli(inputArgs?: string | string[], config?: UserConfig): Promise<({ inputConfig: UserConfig } & RelionResult) | undefined> {
	if (typeof inputArgs === 'string') inputArgs = inputArgs.split(' ')
	inputArgs = inputArgs ? [inputArgs].flat() : process.argv.slice(2)

	const parsedArgs = cli({
		name: 'relion',
		flags: {
			lifecycle: {
				alias: 'f',
				type: String,
				description: 'Lifecycle steps to run in order ((b)ump, change(l)og, co(m)mit, (t)ag, or "all").',
			},
			config: {
				alias: 'c',
				type: String,
				description: 'Path to the config file',
				default: 'relion.config.ts',
			},
			profile: {
				alias: 'p',
				type: String,
				description: 'Use config profile',
			},
			dry: {
				alias: 'd',
				type: Boolean,
				description: 'Run without making any changes',
			},
			latest: {
				alias: 'L',
				type: Boolean,
				description: 'Use the latest-release commit range in changelog',
				default: false,
			},
		},
	}, undefined, [...inputArgs])

	// argv may be undefined if --help was passed
	if (!(parsedArgs as ReturnType<typeof cli> | undefined)) return

	config = config ? structuredClone(config) : await loadConfigFile(parsedArgs.flags.config)

	let activeProfile: UserConfig
	const profileName = parsedArgs.flags.profile ?? config.profile
	if (profileName) {
		const profile = config[`_${profileName}`]
		if (!profile) throw new Error(`Profile '${profileName}' not found in config`)
		config.profile = profileName
		activeProfile = profile
	} else {
		activeProfile = config._default ??= {}
	}

	if (parsedArgs.flags.lifecycle) activeProfile.lifecycle = parseLifecycleFlag(parsedArgs.flags.lifecycle)
	if (parsedArgs.flags.dry) activeProfile.dryRun = true
	if (parsedArgs.flags.latest) {
		activeProfile.changelog ??= {}
		activeProfile.changelog.commitRange = 'latest-release'
	}

	return { inputConfig: config, ...await relion(config) }
}