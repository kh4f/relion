import { describe, it } from 'vitest'
import relion from '@/.'

describe('Test all lifecycles', () => {
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