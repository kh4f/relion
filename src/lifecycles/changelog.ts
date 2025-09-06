import { getVersionTags } from '@/utils'
import type { ReleaseContext, ReleaseWithGroupedCommits, ResolvedConfig } from '@/types'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import Handlebars from 'handlebars'
import releaseTemplate from '@/templates/release.hbs'

export const changelog = (config: ResolvedConfig): void => {
	if (!config.changelog) return

	const options = config.changelog
	const releases = config.context.releases
	if (!releases) return

	const versionTags = getVersionTags(config.prevReleaseTagPattern)

	Handlebars.registerPartial(options.compiledPartials)
	Handlebars.registerHelper(options.helpers)

	let result = options.header
	releases.forEach((release: ReleaseWithGroupedCommits, index: number) => {
		const prevRelease = releases[index + 1] as ReleaseWithGroupedCommits | undefined
		let prevTag: string | undefined, prevVersion: string | undefined
		if (prevRelease) {
			prevTag = prevRelease.tag
			prevVersion = getVersionFromTag(prevTag, config.prevReleaseTagPattern)
		} else {
			const targetTagIndex = versionTags.indexOf(release.tag)
			if (targetTagIndex === -1) {
				prevTag = config.context.currentTag
				prevVersion = getVersionFromTag(prevTag, config.prevReleaseTagPattern)
			} else {
				prevTag = versionTags[targetTagIndex + 1]
				prevVersion = prevTag && getVersionFromTag(prevTag, config.prevReleaseTagPattern)
			}
		}
		const releaseContext: ReleaseContext = {
			...release,
			...config.context,
			prevTag,
			prevVersion,
		}
		const rendered = renderTemplate(releaseTemplate, releaseContext)
		result += rendered
	})

	if (options.stdout) {
		console.log(`Generated changelog:\n${result}`)
	}
	if (options.outputFile) {
		console.log(`Writing changelog to file '${options.outputFile}'`)
		if (!config.dryRun) writeToChangelogFile(options.outputFile, result, options.prevReleaseHeaderPattern)
	}
}

const writeToChangelogFile = (outputFile: string, content: string, prevReleaseHeaderPattern: RegExp): void => {
	const changelogContent = existsSync(outputFile) ? readFileSync(outputFile, { encoding: 'utf8' }) : ''
	const prevReleaseStart = changelogContent.search(prevReleaseHeaderPattern)
	const headlessChangelog = changelogContent.slice(prevReleaseStart)
	const newChangelog = content + headlessChangelog
	writeFileSync(outputFile, newChangelog, { encoding: 'utf8' })
}

const renderTemplate = (template: string, releaseContext: ReleaseContext): string => {
	const compile = Handlebars.compile(template)
	return compile(releaseContext)
}

const getVersionFromTag = (tag: string, tagPattern: RegExp): string | undefined => {
	return tagPattern.exec(tag)?.groups?.version
}