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
		console.log(config, inputConfig)
		expect(inputConfig).toEqual({
			...config,
			lifecycle: ['changelog'],
			profile: 'github',
			changelog: { commitRange: 'latest-release' },
		})
	})
})

describe('lifecycle flag parsing', () => {
	it('sets lifecycle to "all" when "-f all" is passed', async () => {
		expect((await runCli('-f all', {}))?.inputConfig).toEqual({ lifecycle: 'all' })
	})

	it('maps "-f l" to ["changelog"]', async () => {
		expect((await runCli('-f l', {}))?.inputConfig).toEqual({ lifecycle: ['changelog'] })
	})

	it('maps "-f bt" to ["bump","tag"]', async () => {
		expect((await runCli('-f bt', {}))?.inputConfig).toEqual({ lifecycle: ['bump', 'tag'] })
	})

	it('parses composite alias "-f tmlb" and preserves order', async () => {
		expect((await runCli('-f tmlb', {}))?.inputConfig).toEqual({ lifecycle: ['tag', 'commit', 'changelog', 'bump'] })
	})

	it('throws on invalid lifecycle alias', async () => {
		await expect(() => runCli('-f tclb', {})).rejects.toThrowError(`Invalid lifecycle step alias: 'c'`)
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