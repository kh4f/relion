import { dirname, resolve as pathResolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import type { ResolveHook } from 'node:module'

export const resolve: ResolveHook = (specifier, context, defaultResolve) => {
	if (!/^\.{1,2}\//.test(specifier) || !context.parentURL) return defaultResolve(specifier, context)
	const parentDir = dirname(fileURLToPath(context.parentURL))
	const absPath = pathResolve(parentDir, specifier + '.ts')
	const fileUrl = pathToFileURL(absPath).href
	return defaultResolve(fileUrl, context)
}