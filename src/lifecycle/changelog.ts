import { extractVersionFromTag, getReleaseTags, log } from '@/utils'
import type { ReleaseContext, ReleaseWithTypeGroups, ResolvedChangelogOptions, ResolvedConfig } from '@/types'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import Handlebars from 'handlebars'
import releaseTemplate from '@/templates/release.hbs'
import { promptToContinue } from '@/utils/prompter'

export const changelog = async (config: ResolvedConfig): Promise<string | null> => {
	if (!config.changelog) return null
	const result = config.changelog.extractFromFile ? config.changelog.compiledPartials as string : generateChangelog(config)
	if (result) await handleChangelogOutput(config.changelog, config, result)
	return result
}

const generateChangelog = (config: ResolvedConfig): string | null => {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const options = config.changelog!
	const releases = config.context.releases
	if (!releases) return null

	const releaseTags = getReleaseTags(config.prevReleaseTagPattern)

	// Create a local Handlebars instance to avoid global state pollution
	const hbs = Handlebars.create()
	hbs.registerPartial(options.compiledPartials as Record<string, HandlebarsTemplateDelegate>)
	hbs.registerHelper(options.helpers)

	let result = options.header
	releases.forEach((release: ReleaseWithTypeGroups, index: number) => {
		let prevRelease = releases[index + 1] as Partial<ReleaseWithTypeGroups> | undefined
		if (!prevRelease) {
			const targetTagIndex = releaseTags.indexOf(release.tag)
			if (targetTagIndex !== -1) {
				const prevTag = releaseTags[targetTagIndex + 1]
				prevRelease = { tag: prevTag, version: prevTag && extractVersionFromTag(prevTag, config.prevReleaseTagPattern) }
			} else {
				prevRelease = { tag: config.context.currentTag, version: config.context.currentVersion }
			}
		}
		const releaseContext: ReleaseContext = { ...release, ...config.context, prevRelease }
		const rendered = hbs.compile(releaseTemplate)(releaseContext, { data: { _handlebars: hbs } })
		result += rendered
	})

	return result
}

const handleChangelogOutput = async (options: ResolvedChangelogOptions, config: ResolvedConfig, result: string): Promise<void> => {
	if (options.output === 'stdout' || config.dryRun) {
		log(`Generated changelog:`)
		console.log(result)
	} else {
		log(`Writing changelog to file '${options.file}'`)
		writeToFile(options.file, result, options.latestReleasePattern)
	}

	if (options.review && options.output === 'file' && (config.commit || config.tag))
		await promptToContinue('Please review the changelog and press Enter to continue...')
}

const writeToFile = (outputFile: string, content: string, latestReleasePattern: RegExp): void => {
	const changelogContent = existsSync(outputFile) ? readFileSync(outputFile, { encoding: 'utf8' }) : ''
	const latestReleaseStart = changelogContent.search(latestReleasePattern)
	const headlessChangelog = changelogContent.slice(latestReleaseStart).trim()
	if (!headlessChangelog) content = content.trim()
	const newChangelog = content + headlessChangelog
	writeFileSync(outputFile, newChangelog, { encoding: 'utf8' })
}