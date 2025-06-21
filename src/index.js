import bump, { getNewVersion } from './lib/lifecycles/bump.js'
import changelog from './lib/lifecycles/changelog.js'
import commit from './lib/lifecycles/commit.js'
import fs from 'fs'
import latestSemverTag from './lib/latest-semver-tag.js'
import path from 'path'
import printError from './lib/print-error.js'
import tag from './lib/lifecycles/tag.js'
import { resolveUpdaterObjectFromArgument } from './lib/updaters/index.js'
import defaults from './defaults.js'
import { mergician } from 'mergician'
import { execSync } from 'child_process'

export default async function relion(argv) {
	/**
	 * `--message` (`-m`) support will be removed in the next major version.
	 */
	const message = argv.m || argv.message
	if (message) {
		/**
		 * The `--message` flag uses `%s` for version substitutions, we swap this
		 * for the substitution defined in the config-spec for future-proofing upstream
		 * handling.
		 */
		argv.preset.releaseCommitMessageFormat = message.replace(/%s/g, '{{currentTag}}')
		if (!argv.silent) {
			console.warn(
				'[relion]: --message (-m) will be removed in the next major release. Use --releaseCommitMessageFormat.',
			)
		}
	}

	if (argv.changelogHeader) {
		argv.preset.header = argv.changelogHeader
		if (!argv.silent) {
			console.warn(
				'[relion]: --changelogHeader will be removed in the next major release. Use --header.',
			)
		}
	}

	if (argv.preset.header && argv.preset.header.search(changelog.START_OF_LAST_RELEASE_PATTERN) !== -1) {
		throw Error(`custom changelog header must not match ${changelog.START_OF_LAST_RELEASE_PATTERN}`)
	}

	/**
	 * If an argument for `packageFiles` provided, we include it as a "default" `bumpFile`.
	 */
	if (argv.packageFiles) {
		defaults.bumpFiles = defaults.bumpFiles.concat(argv.packageFiles)
	}

	let args = mergician(defaults, argv)
	if (args.profile) {
		args = mergeProfileConfig(args)
	}

	let pkg
	for (const packageFile of args.packageFiles) {
		const updater = await resolveUpdaterObjectFromArgument(packageFile)
		if (!updater) return
		const pkgPath = path.resolve(process.cwd(), updater.filename)
		try {
			const contents = fs.readFileSync(pkgPath, 'utf8')
			pkg = {
				version: updater.updater.readVersion(contents),
				private:
					typeof updater.updater.isPrivate === 'function'
						? updater.updater.isPrivate(contents)
						: false,
			}
			break
		}
		catch (err) {
			/* This probably shouldn't be empty? */
		}
	}
	try {
		let version
		if (pkg && pkg.version) {
			version = pkg.version
		}
		else if (args.gitTagFallback) {
			version = await latestSemverTag(args)
		}
		else {
			throw new Error('no package file found')
		}

		if (args.all) {
			args.bump = true
			args.changelog = true
			args.commit = true
			args.tag = true
		}

		const newVersion = await getNewVersion(args, version)
		args.context.version = newVersion
		args.context.newTag = args.tagPrefix + newVersion

		if (lastCommitHasTag()) {
			// use the current version as the new version if there's no new commits
			// to avoid empty new release changelog generation
			args.context.version = version

			if (args.releaseCount === 1) {
				// genearate the last release changelog
				args.releaseCount = 2
			}
		}

		args.bump && (await bump(args, newVersion))
		args.changelog && (await changelog(args, newVersion))
		args.commit && (await commit(args, newVersion))
		args.tag && (await tag(newVersion, pkg ? pkg.private : false, args))
	}
	catch (err) {
		printError(args, err.message)
		throw err
	}
}

function lastCommitHasTag() {
	const lastCommit = execSync('git rev-parse HEAD').toString().trim()
	const tags = execSync(`git tag --points-at ${lastCommit}`).toString().trim()
	return !!tags
}

/**
 * Merge profile config if args.profile is specified.
 * Merges args._<profile> into args, then deletes args._<profile>.
 */
function mergeProfileConfig(args) {
	function uniqBy(arr, keyFn) {
		const seen = new Set()
		return arr.filter((item) => {
			const key = keyFn(item)
			if (seen.has(key)) return false
			seen.add(key)
			return true
		})
	}

	const profileKey = `_${args.profile}`
	const merged = mergician({
		prependArrays: true,
		dedupArrays: true,
	})(args, structuredClone(args[profileKey]))

	const dedupedTypes = uniqBy(merged.preset.types, item => item.type)
	merged.preset.types = dedupedTypes

	delete merged[profileKey]
	return merged
}