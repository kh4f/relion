import { describe, it, expect, vi, beforeAll } from 'vitest'
import { runCli } from '@/cli'
import type { UserConfig } from '@/types'
import { logSpy } from './setup'

describe('runCli', () => {
	it('should update config options according to CLI flags', async () => {
		expect((await runCli('--bump --changelog --commit --tag --dry', {}))?.inputConfig).toMatchObject({
			bump: true, changelog: true, commit: true, tag: true, dryRun: true,
		})
	})

	it(`should apply 'github' profile and 'latest-release' commit range`, async () => {
		const config: UserConfig = {
			_github: {
				context: { commitHyperlink: false },
				changelog: {
					header: '',
					partials: { header: '' },
				},
			},
		}
		const inputConfig = (await runCli('--changelog --profile github --latest', config))?.inputConfig
		expect(inputConfig).toMatchObject({ ...config, profile: 'github', changelog: { commitRange: 'latest-release' } })
	})
})

describe.runIf(process.env.VITEST_VSCODE)('manual runCli inspection', () => {
	beforeAll(() => logSpy.mockRestore())

	it('should output help message when `--help` is passed', async () => {
		const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never)
		await runCli('--help', {})
		expect(exitSpy).toHaveBeenCalledWith(0)
	})

	it('should load config from default path (relion.config.ts)', async () => {
		await runCli('--changelog --dry')
	})

	it('should load config from custom path', async () => {
		await runCli('--config tests/fixtures/relion.config.cli.ts --dry')
	})
})