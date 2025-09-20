import { describe, it, expect, vi } from 'vitest'
import { runCli } from '@/cli'

describe('CLI', () => {
	it('should print help message when `--help` is passed', async () => {
		const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never)
		await runCli(undefined, ['--help'])
		expect(exitSpy).toHaveBeenCalledWith(0)
	})

	it('should simulate all lifecycles with options from config file', async () => {
		await runCli(undefined, ['-blct', '-d'])
	})

	it(`should output latest release changelog using 'github' profile`, async () => {
		await runCli(undefined, ['-l', '-p', 'github', '-L'])
	})
})