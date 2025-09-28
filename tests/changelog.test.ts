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

describe('partials customization', () => {
	it('should generate changelog with customized partials', () => {
		expect(relion({
			changelog: {
				commitRange: { releaseTag: 'v0.8.0' },
				header: '',
				partials: {
					header: '',
					main: '',
					changelogUrl: '{{repo.homepage}}/blob/main/CHANGELOG.md',
					footer: '##### &emsp;&ensp;&nbsp;&nbsp; [_Release Changelog_]({{>changelogUrl}}) &ensp;•&ensp; [_All Release Commits_]({{>compareLink}}) &ensp;•&ensp; _{{date}}_\n\n\n---',
				},
			},
		}).generatedChangelog).toMatchSnapshot()
	})

	it('should generate changelog with transformed partials', () => {
		expect(relion({
			changelog: {
				commitRange: { releaseTag: 'v0.8.0' },
				partials: {
					header: fallback => `CUSTOM HEADER---${fallback}---`,
					footer: fallback => `CUSTOM FOOTER---${fallback}---`,
				},
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