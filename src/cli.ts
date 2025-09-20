import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import relion from './index.js'
import type { UserConfig } from '@/types'
import { cli } from 'cleye'

if (import.meta.main) await runCli()

export async function runCli(config?: UserConfig, argvs?: string[]) {
	const argv = cli({
		name: 'relion',
		flags: {
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
				alias: 'c',
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
	}, undefined, argvs)

	if (!config) {
		try {
			const configFileURL = pathToFileURL(resolve(process.cwd(), 'relion.config.ts')).href
			config = ((await import(configFileURL)) as { default: UserConfig }).default
		} catch (error) {
			throw new Error(`Error loading config: ${(error as Error).message}`)
		}
	}

	// argv may be undefined if --help was passed
	if (!(argv as ReturnType<typeof cli> | undefined)) return

	if (!argv.flags.bump) config.bump = false
	if (!argv.flags.changelog) config.changelog = false
	if (!argv.flags.commit) config.commit = false
	if (!argv.flags.tag) config.tag = false
	if (argv.flags.profile) config.profile = argv.flags.profile
	if (argv.flags.dryRun) config.dryRun = argv.flags.dryRun
	if (argv.flags.latest && config.changelog) {
		if (config.changelog === true) config.changelog = {}
		config.changelog.commitRange = 'latest-release'
	}

	return await relion(config)
}