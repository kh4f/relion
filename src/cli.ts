import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import relion from './index.js'
import type { UserConfig } from '@/types'
import { cli } from 'cleye'

if (import.meta.main) await runCli()

export async function runCli(inputArgs?: string | string[], config?: UserConfig) {
	if (typeof inputArgs === 'string') inputArgs = inputArgs.split(' ')
	inputArgs = inputArgs && [inputArgs].flat()

	const parsedArgs = cli({
		name: 'relion',
		flags: {
			config: {
				alias: 'c',
				type: String,
				description: 'Path to the config file',
				default: 'relion.config.ts',
			},
			bump: {
				alias: 'b',
				type: Boolean,
				description: 'Bump the version',
				default: false,
			},
			changelog: {
				alias: 'l',
				type: Boolean,
				description: 'Generate a changelog',
				default: false,
			},
			commit: {
				alias: 'm',
				type: Boolean,
				description: 'Create a commit',
				default: false,
			},
			tag: {
				alias: 't',
				type: Boolean,
				description: 'Create a tag',
				default: false,
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

	config ??= await loadConfigFile(parsedArgs.flags.config)

	config.bump ||= parsedArgs.flags.bump
	config.changelog ||= parsedArgs.flags.changelog
	config.commit ||= parsedArgs.flags.commit
	config.tag ||= parsedArgs.flags.tag
	config.profile ??= parsedArgs.flags.profile
	config.dryRun ??= parsedArgs.flags.dry
	if (parsedArgs.flags.latest && config.changelog) {
		if (config.changelog === true) config.changelog = {}
		config.changelog.commitRange = 'latest-release'
	}

	return { inputConfig: config, ...relion(config) }
}

const loadConfigFile = async (configPath: string): Promise<UserConfig> => {
	try {
		const configFileURL = pathToFileURL(resolve(process.cwd(), configPath)).href
		return ((await import(configFileURL)) as { default: UserConfig }).default
	} catch (error) {
		throw new Error(`Error loading config: ${(error as Error).message}`)
	}
}