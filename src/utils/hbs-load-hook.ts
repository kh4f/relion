import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { LoadHook } from 'node:module'

export const load: LoadHook = (url, context, nextLoad) => url.endsWith('.hbs')
	? {
		format: 'module',
		shortCircuit: true,
		source: `export default ${JSON.stringify(readFileSync(fileURLToPath(url), 'utf8'))}`,
	}
	: nextLoad(url, context)