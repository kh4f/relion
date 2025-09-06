import { describe, it, expect } from 'vitest'
import relion from '@/index'

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
					from: 'HEAD~2',
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
					from: 'HEAD~2',
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
})