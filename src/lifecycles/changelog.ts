import { extractVersionFromTag, getVersionTags, log, renderTemplate } from '@/utils'
import type { ReleaseContext, ReleaseWithTypeGroups, ResolvedConfig } from '@/types'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import Handlebars from 'handlebars'
import releaseTemplate from '@/templates/release.hbs'

export const changelog = (config: ResolvedConfig): string | null => {
	if (!config.changelog) return null

	const options = config.changelog
	const releases = config.context.releases
	if (!releases) return null

	const versionTags = getVersionTags(config.prevReleaseTagPattern)

	Handlebars.registerPartial(options.compiledPartials)
	Handlebars.registerHelper(options.helpers)

	let result = options.header
	releases.forEach((release: ReleaseWithTypeGroups, index: number) => {
		let prevRelease = releases[index + 1] as Partial<ReleaseWithTypeGroups> | undefined
		if (!prevRelease) {
			const targetTagIndex = versionTags.indexOf(release.tag)
			if (targetTagIndex !== -1) {
				const prevTag = versionTags[targetTagIndex + 1]
				prevRelease = { tag: prevTag, version: prevTag && extractVersionFromTag(prevTag, config.prevReleaseTagPattern) }
			} else {
				prevRelease = { tag: config.context.currentTag, version: config.context.currentVersion }
			}
		}
		const releaseContext: ReleaseContext = { ...release, ...config.context, prevRelease }
		const rendered = renderTemplate(releaseTemplate, releaseContext)
		result += rendered
	})

	if (options.output === 'stdout') {
		log(`Generated changelog:`)
		console.log(result)
	} else {
		log(`Writing changelog to file '${options.output}'`)
		if (!config.dryRun) writeToChangelogFile(options.output, result, options.prevReleaseHeaderPattern)
	}

	return result
}

const writeToChangelogFile = (outputFile: string, content: string, prevReleaseHeaderPattern: RegExp): void => {
	const changelogContent = existsSync(outputFile) ? readFileSync(outputFile, { encoding: 'utf8' }) : ''
	const prevReleaseStart = changelogContent.search(prevReleaseHeaderPattern)
	const headlessChangelog = changelogContent.slice(prevReleaseStart)
	const newChangelog = content + headlessChangelog
	writeFileSync(outputFile, newChangelog, { encoding: 'utf8' })
}