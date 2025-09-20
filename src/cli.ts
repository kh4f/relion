import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import relion from './index.js'
import type { UserConfig } from '@/types'
import { cli } from 'cleye'

if (import.meta.main) await runCli()

export async function runCli(config?: UserConfig, inputArgs?: string | string[]) {
	if (typeof inputArgs === 'string') inputArgs = inputArgs.split(' ')
	inputArgs = inputArgs && [inputArgs].flat()

	const parsedArgs = cli({
		name: 'relion',
		flags: {
			config: {
				alias: 'c',
				type: String,
				description: 'Path to the config file',
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
			dryRun: {
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

	if (!config) {
		try {
			const configPath = parsedArgs.flags.config ?? 'relion.config.ts'
			const configFileURL = pathToFileURL(resolve(process.cwd(), configPath)).href
			config = ((await import(configFileURL)) as { default: UserConfig }).default
		} catch (error) {
			throw new Error(`Error loading config: ${(error as Error).message}`)
		}
	}

	// argv may be undefined if --help was passed
	if (!(parsedArgs as ReturnType<typeof cli> | undefined)) return

	config.bump ||= parsedArgs.flags.bump
	config.changelog ||= parsedArgs.flags.changelog
	config.commit ||= parsedArgs.flags.commit
	config.tag ||= parsedArgs.flags.tag
	config.profile ??= parsedArgs.flags.profile
	config.dryRun ??= parsedArgs.flags.dryRun
	if (parsedArgs.flags.latest && config.changelog) {
		if (config.changelog === true) config.changelog = {}
		config.changelog.commitRange = 'latest-release'
	}

	return await relion(config)
}