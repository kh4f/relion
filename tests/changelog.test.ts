import { describe, expect, it } from 'vitest'
import relion from '@/.'

describe('changelog generation', () => {
	it.for(['v0.7.0', 'v0.8.0'])('should generate changelog for release $0', (releaseTag) => {
		expect(relion({ changelog: { commitRange: { releaseTag } } }).generatedChangelog).toMatchSnapshot()
	})

	it.for(['v0.7.0', 'v0.8.0'])('should generate changelog for release $0 without scope groups', (releaseTag) => {
		expect(relion({ changelog: { commitRange: { releaseTag }, groupCommitsByScope: false } }).generatedChangelog).toMatchSnapshot()
	})

	it('should generate changelog with scope groups for custom commits', () => {
		expect(relion({
			changelog: {
				header: '',
				partials: { header: '', footer: '' },
			},
			context: {
				commitHyperlink: false,
				commits: [
					{ message: 'fix: unscoped commit 3' },
					{ message: 'feat: unscoped commit 2' },
					{ message: 'feat(scope 2): scoped commit 3' },
					{ message: 'feat(scope 2): scoped commit 2' },
					{ message: 'feat(scope 1): scoped commit 1' },
					{ message: 'feat: unscoped commit 1' },
				],
			},
		}).generatedChangelog).toMatchSnapshot()
	})
})

describe.runIf(process.env.VITEST_VSCODE)('changelog generation (manual)', () => {
	it('should print upcoming release changelog', () => {
		relion({ changelog: true })
	})

	it('should print latest release changelog', () => {
		relion({ changelog: { commitRange: 'latest-release' } })
	})

	it('should print changelog for last 5 commits', () => {
		relion({ changelog: { commitRange: 'HEAD~5..' } })
	})
})