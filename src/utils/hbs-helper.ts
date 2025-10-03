import Handlebars from 'handlebars'
import releaseTemplate from '@/templates/release.hbs'

export const compilePartials = (partials: Record<string, string | ((fallback: string) => string)>): Record<string, HandlebarsTemplateDelegate> => {
	const resolvedPartials: Record<string, string> = Object.fromEntries(Object.entries(partials).map(([key, templateOrFunction]) => [key, typeof templateOrFunction === 'function' ? transformFallback(key, templateOrFunction) : templateOrFunction]))
	return Object.fromEntries(Object.entries(resolvedPartials).map(([key, template]) => [key, Handlebars.compile(template)]))
}

const transformFallback = (partialName: string, transform: (fallback: string) => string): string => {
	const fallback = new RegExp(`${partialName}.*?}}\\s*(.*?){{~?/${partialName}`, 's').exec(releaseTemplate)?.[1]
	if (!fallback) throw new Error(`Partial "${partialName}" not found in the release template.`)
	return transform(fallback)
}