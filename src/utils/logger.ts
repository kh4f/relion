import type { LogLevel } from '@/types'
import { inspect } from 'node:util'

let logLevel: LogLevel = 'info'

export const setLogLevel = (value: LogLevel) => logLevel = value

export const log = (...args: unknown[]) => {
	if (logLevel !== 'silent') console.log(...args)
}

export const warn = (...args: unknown[]) => {
	if (logLevel === 'info') console.warn(...args)
}

export const deepLog = (value: unknown, depth?: number): void => {
	log(inspect(value, { depth: depth ?? null, colors: true }))
}