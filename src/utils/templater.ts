import Handlebars from 'handlebars'

export const renderTemplate = (template: string, context: unknown): string => {
	const compiledTemplate = Handlebars.compile(template)
	return compiledTemplate(context)
}