import { describe, it, expect } from 'vitest'
import relion from '@/index'
import { spawnSync } from 'node:child_process'

describe('Smoke test', () => {
	it('should pass', () => {
		expect(1 + 1).toBe(2)
	})
})

describe('Test all lifecycles', () => {
	it('should bump version, generate changelog, commit and tag changes', async () => {
		await relion({
			versionSourceFile: 'package.json',
			bump: [],
			changelog: {
				outputFile: 'temp/CHANGELOG.md',
				commitRange: {
					from: 'HEAD~5',
				},
			},
			commit: {
				gpgSign: true,
			},
			tag: {
				gpgSign: true,
			},
			dryRun: true,
		})
	})
	it('should print generated changelog to console', async () => {
		await relion({
			dryRun: true,
			changelog: {
				stdout: true,
				commitRange: {
					from: 'HEAD~5',
				},
			},
		})
	})
	it('should generate changelog without commit hyperlinks', async () => {
		await relion({
			dryRun: true,
			changelog: {
				stdout: true,
				commitRange: {
					from: 'HEAD~5',
				},
			},
			profile: 'testProfile',
			_testProfile: {
				context: {
					commitHyperlink: false,
				},
			},
		})
	})
	it(`should generate changelog without commit hyperlinks and headers to 'RELEASE.md'`, async () => {
		await relion({
			dryRun: true,
			changelog: {
				stdout: true,
				commitRange: {
					from: 'HEAD~5',
				},
			},
			profile: 'github',
			_github: {
				context: {
					commitHyperlink: false,
				},
				changelog: {
					outputFile: 'RELEASE.md',
					header: '',
					partials: {
						header: '',
					},
				},
			},
		})
	})
	it('should generate changelog for latest release', async () => {
		await relion({
			dryRun: true,
			changelog: {
				stdout: true,
				commitRange: 'latest-release',
			},
		})
	})
})

describe('Test cli', () => {
	it('should print help message', () => {
		const spawnResult = spawnSync('node ./dist/cli.js --help', { shell: true })
		process.stdout.write(spawnResult.stdout)
		process.stderr.write(spawnResult.stderr)
	})
	it('should run all lifecycles with options from config file in dry run mode', { timeout: 10000 }, () => {
		const spawnResult = spawnSync('node ./dist/cli.js -blct -d', { shell: true })
		process.stdout.write(spawnResult.stdout)
		process.stderr.write(spawnResult.stderr)
	})
	it(`should generate changelog with 'github' profile`, { timeout: 10000 }, () => {
		const spawnResult = spawnSync('node dist/cli.js -l -p github -d', { shell: true })
		process.stdout.write(spawnResult.stdout)
		process.stderr.write(spawnResult.stderr)
	})
})