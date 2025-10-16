import Handlebars from 'handlebars'
import { readFileSync } from 'node:fs'
import releaseTemplate from '@/templates/release.hbs'
import type { CompleteChangelogOptions, Context, ResolvedChangelogOptions } from '@/types'

export const resolvePartials = (options: CompleteChangelogOptions, context: Context): ResolvedChangelogOptions['compiledPartials'] => {
	let changelogContent, extractedPartials: Record<string, string> | undefined
	const isPartialExtractionUsed = Object.keys(options.partials).find(key => options.partials[key] === 'from-file')
	if (options.extractFromFile || isPartialExtractionUsed) {
		changelogContent = readFileSync(options.file, 'utf-8')
		extractedPartials = options.latestReleasePattern.exec(changelogContent)?.groups ?? {}
		if (options.extractFromFile) return modifyPartialWithContext(Object.values(extractedPartials).join(''), context)
	}

	const resolvedPartials: Record<string, string> = Object.fromEntries(Object.entries(options.partials).map(([key, rawPartial]) => {
		let partial: string
		if (typeof rawPartial === 'function') {
			partial = transformFallback(key, rawPartial)
		} else if (rawPartial === 'from-file') {
			partial = extractedPartials?.[key] ?? ''
			if (!partial) throw new Error(`Partial '${key}' not found in the latest release changelog.`)
			partial = modifyPartialWithContext(partial, context)
		} else {
			partial = rawPartial
		}
		return [key, partial]
	}))
	return Object.fromEntries(Object.entries(resolvedPartials).map(([key, template]) => [key, Handlebars.compile(template)]))
}

const modifyPartialWithContext = (partial: string, context: Context): string => {
	if (context.commitRefLinks === false) partial = partial.replace(/\[`?([^\]]+?)`?\]\(.+?\)/g, '$1')
	return partial
}

const transformFallback = (partialName: string, transform: (fallback: string) => string): string => {
	const fallback = new RegExp(`${partialName}.*?}}\\s*(.*?){{~?/${partialName}`, 's').exec(releaseTemplate)?.[1]
	if (!fallback) throw new Error(`Partial "${partialName}" not found in the release template.`)
	return transform(fallback)
}