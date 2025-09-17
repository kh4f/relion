import Handlebars from 'handlebars'

export const renderTemplate = (template: string, context: unknown): string => {
	const compiledTemplate = Handlebars.compile(template)
	return compiledTemplate(context)
}

export const compilePartials = (partials: Record<string, string>): Record<string, HandlebarsTemplateDelegate> =>
	Object.fromEntries(Object.entries(partials).map(([key, template]) => [key, Handlebars.compile(template)]))