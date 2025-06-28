import bump, { getNewVersion } from './lib/lifecycles/bump.js'
import changelog from './lib/lifecycles/changelog.js'
import commit from './lib/lifecycles/commit.js'
import { readFileSync } from 'fs'
import tag from './lib/lifecycles/tag.js'
import defaults from './defaults.js'
import { mergician } from 'mergician'
import { execSync } from 'child_process'

export default async function relion(argv) {
	let args = mergician(defaults, argv)
	if (args.profile) args = mergeProfileConfig(args)

	if (args.all) args.bump = args.changelog = args.commit = args.tag = true

	const currentVersion = getCurrentVersion()
	const newVersion = await getNewVersion(args, currentVersion)
	args.context.version = newVersion
	args.context.newTag = args.tagPrefix + newVersion

	if (lastCommitHasTag()) {
		// use the current version as the new version if there's no new commits
		// to avoid empty new release changelog generation
		args.context.version = currentVersion

		if (args.releaseCount === 1) {
			// genearate the last release changelog
			args.releaseCount = 2
		}
	}

	if (args.bump) await bump(args, newVersion)
	if (args.changelog) await changelog(args, newVersion)
	if (args.commit) await commit(args, newVersion)
	if (args.tag) await tag(newVersion, false, args)
}

function getCurrentVersion() {
	const packageJsonContent = readFileSync('package.json', 'utf-8')
	return /"version".*?"(.*?)"/.exec(packageJsonContent)?.[1]
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