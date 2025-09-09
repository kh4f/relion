let silent = false

export const setSilent = (value: boolean) => silent = value

export const log = (...args: unknown[]) => {
	if (!silent) console.log(...args)
}