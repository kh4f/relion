import { describe, it, expect, vi } from 'vitest'
import { runCli } from '@/cli'

describe('Test cli', () => {
	it('should print help message', async () => {
		const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never)
		await runCli(undefined, ['--help'])
		expect(exitSpy).toHaveBeenCalledWith(0)
	})

	it('should run all lifecycles with options from config file in dry run mode', { timeout: 10000 }, async () => {
		await runCli(undefined, ['-blct', '-d'])
	})

	it(`should generate changelog with 'github' profile`, { timeout: 10000 }, async () => {
		await runCli(undefined, ['-l', '-p', 'github', '-L'])
	})
})