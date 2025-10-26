import Handlebars from 'handlebars'
import { readFileSync } from 'node:fs'
import releaseTemplate from '@/templates/release.hbs'
import type { CompleteChangelogOptions, Context, ResolvedChangelogOptions } from '@/types'

export const resolvePartials = (options: CompleteChangelogOptions, context: Context): ResolvedChangelogOptions['compiledPartials'] => {
	let changelogContent, extractedPartials: Record<string, string> | undefined
	const isPartialExtractionUsed = Object.keys(options.partials).find(key => options.partials[key] === 'from-file')
	if (options.extractFromFile || isPartialExtractionUsed) {
		changelogContent = readFileSync(options.file, 'utf-8')
		const targetReleaseVersion = (typeof options.extractFromFile === 'boolean' || options.extractFromFile === 'latest-release') ? '' : options.extractFromFile
		const releasePattern = new RegExp(options.releasePattern.source.replace('{{version}}', targetReleaseVersion), options.releasePattern.flags)
		extractedPartials = releasePattern.exec(changelogContent)?.groups ?? {}
		if (options.extractFromFile) return modifyPartialWithContext(Object.values(extractedPartials).join(''), context, options.commitRefLinkPattern)
	}

	const resolvedPartials: Record<string, string> = Object.fromEntries(Object.entries(options.partials).map(([key, rawPartial]) => {
		let partial: string
		if (typeof rawPartial === 'function') {
			partial = transformFallback(key, rawPartial)
		} else if (rawPartial === 'from-file') {
			partial = extractedPartials?.[key] ?? ''
			if (!partial) throw new Error(`Partial '${key}' not found in the latest release changelog.`)
			partial = modifyPartialWithContext(partial, context, options.commitRefLinkPattern)
		} else {
			partial = rawPartial
		}
		return [key, partial]
	}))
	return Object.fromEntries(Object.entries(resolvedPartials).map(([key, template]) => [key, Handlebars.compile(template)]))
}

const modifyPartialWithContext = (partial: string, context: Context, commitRefLinkPattern: RegExp): string => {
	if (context.commitRefLinks === false) partial = partial.replace(commitRefLinkPattern, '$1')
	return partial
}

const transformFallback = (partialName: string, transform: (fallback: string) => string): string => {
	const fallback = new RegExp(`${partialName}.*?}}\\s*(.*?){{~?/${partialName}`, 's').exec(releaseTemplate)?.[1]
	if (!fallback) throw new Error(`Partial "${partialName}" not found in the release template.`)
	return transform(fallback)
}