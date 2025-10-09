import readline from 'node:readline'

export const promptToContinue = async (message: string): Promise<void> => {
	const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
	await new Promise<void>((resolve) => {
		rl.question(message, () => {
			rl.close()
			resolve()
		})
	})
}