import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { LoadHook } from 'node:module'
import Handlebars from 'handlebars'

export const renderTemplate = (template: string, context: unknown): string =>
	Handlebars.compile(template)(context)

export const compilePartials = (partials: Record<string, string>): Record<string, HandlebarsTemplateDelegate> =>
	Object.fromEntries(Object.entries(partials).map(([key, template]) => [key, Handlebars.compile(template)]))

export const load: LoadHook = (url, context, nextLoad) => url.endsWith('.hbs')
	? {
		format: 'module',
		shortCircuit: true,
		source: `export default ${JSON.stringify(readFileSync(fileURLToPath(url), 'utf8'))}`,
	}
	: nextLoad(url, context)