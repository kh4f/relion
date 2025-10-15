import { describe, it, expect, vi } from 'vitest'
import { runCli } from '@/cli'
import relionProjectConfig from '../relion.config'
import relionTestConfig from './fixtures/relion.config.cli'

describe('runCli', () => {
	it('should output help message when `--help` is passed', async () => {
		const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never)
		let log = ''
		const logSpy = vi.spyOn(console, 'log').mockImplementation((msg: string) => log += msg)
		await runCli('--help', {})
		expect(exitSpy).toHaveBeenCalledWith(0)
		expect(log).toMatchSnapshot()
		logSpy.mockRestore()
	})

	it('should load config from default path (relion.config.ts)', async () => {
		expect((await runCli('-f l'))?.inputConfig).toEqual(relionProjectConfig)
	})

	it('should load config from custom path', async () => {
		expect((await runCli('--config tests/fixtures/relion.config.cli.ts --dry'))?.inputConfig).toEqual(relionTestConfig)
	})
})

describe('config transformation via CLI args', () => {
	it('should apply CLI flags to implicit default profile', async () => {
		expect((await runCli('-f l', {}))?.inputConfig).toEqual({
			_default: { lifecycle: ['changelog'] },
		})
	})

	it('should apply CLI flags to explicitly specified default profile', async () => {
		expect((await runCli('-L', { profile: 'default', _default: {} }))?.inputConfig).toEqual({
			profile: 'default',
			_default: { lifecycle: 'all', changelog: { commitRange: 'latest-release' } },
		})
	})

	it('should apply CLI flags to specified custom profile', async () => {
		expect((await runCli('-f l -d', { profile: 'custom', _custom: { lifecycle: 'all' } }))?.inputConfig).toEqual({
			profile: 'custom',
			_custom: { lifecycle: ['changelog'], dryRun: true },
		})
	})

	it('should throw error when specified profile does not exist in config', async () => {
		await expect(() => runCli('', { profile: 'custom' })).rejects.toThrowError(`Profile 'custom' not found in config`)
	})

	it('should throw error when explicitly specified default profile is not defined', async () => {
		await expect(() => runCli('', { profile: 'default' })).rejects.toThrowError(`Profile 'default' not found in config`)
	})
})

describe('lifecycle flag parsing', () => {
	it('should set lifecycle to "all" when "-f all" is passed', async () => {
		expect((await runCli('-f all', {}))?.inputConfig._default).toEqual({ lifecycle: 'all' })
	})

	it('should map "-f l" to ["changelog"]', async () => {
		expect((await runCli('-f l', {}))?.inputConfig._default).toEqual({ lifecycle: ['changelog'] })
	})

	it('should map "-f bt" to ["bump","tag"]', async () => {
		expect((await runCli('-f bt', {}))?.inputConfig._default).toEqual({ lifecycle: ['bump', 'tag'] })
	})

	it('should parse composite alias "-f tmlb" and preserves order', async () => {
		expect((await runCli('-f tmlb', {}))?.inputConfig._default).toEqual({ lifecycle: ['tag', 'commit', 'changelog', 'bump'] })
	})

	it('should throw on invalid lifecycle alias', async () => {
		await expect(() => runCli('-f tclb', {})).rejects.toThrowError(`Invalid lifecycle step alias: 'c'`)
	})
})