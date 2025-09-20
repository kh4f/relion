import { describe, it, expect, vi } from 'vitest'
import { runCli } from '@/cli'

describe('CLI', () => {
	it('should print help message when `--help` is passed', async () => {
		const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never)
		await runCli({}, ['--help'])
		expect(exitSpy).toHaveBeenCalledWith(0)
	})

	it('should simulate full release workflow', async () => {
		await runCli({
			bump: true,
			changelog: true,
			commit: true,
			tag: true,
		}, ['-blmt', '-d'])
	})

	it(`should output latest release changelog using 'github' profile`, async () => {
		await runCli({
			_github: {
				silent: true,
				context: { commitHyperlink: false },
				changelog: {
					output: 'stdout',
					header: '',
					partials: { header: '' },
				},
			},
		}, ['-l', '-p', 'github', '-L'])
	})
})