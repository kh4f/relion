import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import relion from './index.js'
import type { UserConfig, RelionResult } from '@/types'
import { cli } from 'cleye'

const loadConfigFile = async (configPath: string): Promise<UserConfig> => {
	try {
		const configFileURL = pathToFileURL(resolve(process.cwd(), configPath)).href
		return ((await import(configFileURL)) as { default: UserConfig }).default
	} catch (error) {
		throw new Error(`Error loading config: ${(error as Error).message}`)
	}
}

if (import.meta.main) await runCli()

export async function runCli(inputArgs?: string | string[], config?: UserConfig): Promise<({ inputConfig: UserConfig } & RelionResult) | undefined> {
	if (typeof inputArgs === 'string') inputArgs = inputArgs.split(' ')
	inputArgs = inputArgs && [inputArgs].flat()

	const parsedArgs = cli({
		name: 'relion',
		flags: {
			lifecycle: {
				alias: 'f',
				type: String,
				default: 'all',
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
				default: false,
			},
			latest: {
				alias: 'L',
				type: Boolean,
				description: 'Use the latest-release commit range in changelog',
				default: false,
			},
		},
	}, undefined, inputArgs ? [...inputArgs] : process.argv.slice(2))

	// argv may be undefined if --help was passed
	if (!(parsedArgs as ReturnType<typeof cli> | undefined)) return

	config = config ? structuredClone(config) : await loadConfigFile(parsedArgs.flags.config)

	const lifecycle = parsedArgs.flags.lifecycle
	if (lifecycle === 'all') {
		config.lifecycle = lifecycle
	} else {
		const stepsMap = { b: 'bump', l: 'changelog', m: 'commit', t: 'tag' } as const
		config.lifecycle = lifecycle.split('').map(char => {
			if (!(char in stepsMap)) throw new Error(`Invalid lifecycle step alias: '${char}'`)
			return stepsMap[char as keyof typeof stepsMap]
		})
	}
	config.profile ??= parsedArgs.flags.profile
	config.dryRun ??= parsedArgs.flags.dry
	if (parsedArgs.flags.latest && config.lifecycle.includes('changelog')) {
		config.changelog ??= {}
		config.changelog.commitRange = 'latest-release'
	}

	return { inputConfig: config, ...await relion(config) }
}