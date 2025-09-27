import type { LogLevel } from '@/types'

let logLevel: LogLevel = 'info'

export const setLogLevel = (value: LogLevel) => logLevel = value

export const log = (...args: unknown[]) => {
	if (logLevel !== 'silent') console.log(...args)
}

export const warn = (...args: unknown[]) => {
	if (logLevel === 'info') console.warn(...args)
}