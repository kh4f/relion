export * from './config-resolver'
export * from './version-manager'
export * from './commits-parser'
export * from './git-utils'
export * from './logger'

import { inspect } from 'node:util'

export const deepLog = (value: unknown, depth?: number): void => {
	console.log(inspect(value, { depth: depth ?? null, colors: true }))
}