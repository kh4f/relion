import { describe, it, expect, vi } from 'vitest'
import { runCli } from '@/cli'
import type { UserConfig } from '@/types'

describe('runCli', () => {
	it('should update config options according to CLI flags', async () => {
		expect((await runCli('--lifecycle all --dry', {}))?.inputConfig).toEqual({
			lifecycle: 'all', dryRun: true,
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
		const inputConfig = (await runCli('-f l --profile github --latest', config))?.inputConfig
		expect(inputConfig).toEqual({ ...config, profile: 'github', changelog: { commitRange: 'latest-release' } })
	})
})

describe.runIf(process.env.VITEST_VSCODE)('runCli (manual)', () => {
	it('should output help message when `--help` is passed', async () => {
		const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never)
		await runCli('--help', {})
		expect(exitSpy).toHaveBeenCalledWith(0)
	})

	it('should load config from default path (relion.config.ts)', async () => {
		await runCli('-f l --dry')
	})

	it('should load config from custom path', async () => {
		await runCli('--config tests/fixtures/relion.config.cli.ts --dry')
	})
})