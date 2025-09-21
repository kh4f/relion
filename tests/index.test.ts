import { describe, it, expect } from 'vitest'
import relion from '@/.'

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
				output: 'temp/CHANGELOG.md',
				commitRange: 'HEAD~5..',
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
				output: 'stdout',
				commitRange: 'HEAD~5..',
			},
		})
	})
	it('should generate changelog without commit hyperlinks', async () => {
		await relion({
			dryRun: true,
			changelog: {
				output: 'stdout',
				commitRange: 'HEAD~5..',
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
				output: 'stdout',
				commitRange: 'HEAD~5..',
			},
			profile: 'github',
			_github: {
				context: {
					commitHyperlink: false,
				},
				changelog: {
					output: 'RELEASE.md',
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
				output: 'stdout',
				commitRange: 'latest-release',
			},
		})
	})
	it('should print only changelog to console', async () => {
		await relion({
			silent: true,
			changelog: {
				output: 'stdout',
				commitRange: 'HEAD~5..',
			},
		})
	})
})