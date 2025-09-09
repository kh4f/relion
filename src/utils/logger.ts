import { inspect } from 'node:util'

let silent = false

export const setSilent = (value: boolean) => silent = value

export const log = (...args: unknown[]) => {
	if (!silent) console.log(...args)
}

export const deepLog = (value: unknown, depth?: number): void => {
	log(inspect(value, { depth: depth ?? null, colors: true }))
}