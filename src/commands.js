import spec from 'conventional-changelog-config-spec'
import { getConfiguration } from './lib/configuration.js'
import defaults from './defaults.js'
import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'

const yargsInstance = yargs(hideBin(process.argv))
	.usage('Usage: $0 [options]')
	.option('packageFiles', {
		default: defaults.packageFiles,
		array: true,
	})
	.option('bumpFiles', {
		default: defaults.bumpFiles,
		array: true,
	})
	.option('release-as', {
		alias: 'r',
		describe: 'Specify the release type manually (like npm version <major|minor|patch>)',
		requiresArg: true,
		string: true,
	})
	.option('prerelease', {
		alias: 'P',
		describe: 'make a pre-release with optional option value to specify a tag id',
		string: true,
	})
	.option('infile', {
		alias: 'i',
		describe: 'Read the CHANGELOG from this file',
		default: defaults.infile,
	})
	.option('sign', {
		alias: 's',
		describe: 'Should the git commit and tag be signed?',
		type: 'boolean',
		default: defaults.sign,
	})
	.option('signoff', {
		describe: 'Should the git commit have a "Signed-off-by" trailer',
		type: 'boolean',
		default: defaults.signoff,
	})
	.option('no-verify', {
		alias: 'n',
		describe: 'Bypass pre-commit or commit-msg git hooks during the commit phase',
		type: 'boolean',
		default: defaults.noVerify,
	})
	.option('commit-all', {
		alias: 'C',
		describe: 'Commit all staged changes, not just files affected by relion',
		type: 'boolean',
		default: defaults.commitAll,
	})
	.option('silent', {
		describe: 'Don\'t print logs and errors',
		type: 'boolean',
		default: defaults.silent,
	})
	.option('tag-prefix', {
		alias: 'T',
		describe: 'Set a custom prefix for the git tag to be created',
		type: 'string',
		default: defaults.tagPrefix,
	})
	.option('release-count', {
		describe:
			'How many releases of changelog you want to generate. It counts from the upcoming release. Useful when you forgot to generate any previous changelog. Set to 0 to regenerate all.',
		type: 'number',
		default: defaults.releaseCount,
	})
	.option('tag-force', {
		describe: 'Allow tag replacement',
		type: 'boolean',
		default: defaults.tagForce,
	})
	.option('scripts', {
		describe: 'Provide scripts to execute for lifecycle events (prebump, precommit, etc.,)',
		default: defaults.scripts,
	})
	.option('bump', {
		alias: 'b',
		describe: 'Bump the version in bumpFiles',
		type: 'boolean',
		default: defaults.bump,
	})
	.option('changelog', {
		alias: 'l',
		describe: 'Generate a changelog',
		type: 'boolean',
		default: defaults.changelog,
	})
	.option('commit', {
		alias: 'c',
		describe: 'Create a git commit',
		type: 'boolean',
		default: defaults.commit,
	})
	.option('tag', {
		alias: 't',
		describe: 'Create a git tag',
		type: 'boolean',
		default: defaults.tag,
	})
	.option('all', {
		alias: 'a',
		describe: 'Run all lifecycle events',
		type: 'boolean',
		default: defaults.all,
	})
	.option('context.linkReferences', {
		describe: 'Should all references be linked?',
		type: 'boolean',
		default: defaults.context.linkReferences,
	})
	.option('context.fullChangelogLink', {
		describe: 'Add a "Full Changelog: v1...v2" link to the footer',
		type: 'boolean',
		default: defaults.context.fullChangelogLink,
	})
	.option('profile', {
		alias: 'p',
		describe: 'Specify a named config profile to merge with the base config (properties under _<profile-name> in .versionrc)',
		type: 'string',
	})
	.option('dry-run', {
		type: 'boolean',
		default: defaults.dryRun,
		describe: 'See the commands that running relion would run',
	})
	.option('git-tag-fallback', {
		type: 'boolean',
		default: defaults.gitTagFallback,
		describe:
			'fallback to git tags for version, if no meta-information file is found (e.g., package.json)',
	})
	.option('path', {
		type: 'string',
		describe: 'Only populate commits made under this path',
	})
	.option('lerna-package', {
		type: 'string',
		describe: 'Name of the package from which the tags will be extracted',
	})
	.option('npmPublishHint', {
		type: 'string',
		default: defaults.npmPublishHint,
		describe: 'Customized publishing hint',
	})
	.check((argv) => {
		if (typeof argv.scripts !== 'object' || Array.isArray(argv.scripts)) {
			throw Error('scripts must be an object')
		}
		else {
			return true
		}
	})
	.alias('version', 'v')
	.alias('help', 'h')
	.example('$0', 'Update changelog and tag release')
	.example(
		'$0 -m "%s: see changelog for details"',
		'Update changelog and tag release with custom commit message',
	)
	.pkgConf('relion')
	.config(await getConfiguration())
	.wrap(97)

Object.keys(spec.properties).forEach((propertyKey) => {
	const property = spec.properties[propertyKey]
	if (!defaults.preset[propertyKey]) return
	yargsInstance.option('preset.' + propertyKey, {
		type: property.type,
		describe: property.description,
		default: defaults.preset[propertyKey],
	})
})

export default yargsInstance