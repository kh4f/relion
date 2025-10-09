import { describe, expect, it } from 'vitest'
import relion, { sectionsSelector, type UserConfig } from '@/.'

describe('changelog generation', () => {
	it.for(['v0.7.0', 'v0.8.0'])('should generate changelog for release $0', async (releaseTag) => {
		expect((await relion({ changelog: { commitRange: { releaseTag } } })).generatedChangelog).toMatchSnapshot()
	})

	it.for(['v0.7.0', 'v0.8.0'])('should generate changelog for release $0 without scope groups', async (releaseTag) => {
		expect((await relion({ changelog: { commitRange: { releaseTag }, groupCommitsByScope: false } })).generatedChangelog).toMatchSnapshot()
	})

	it('should generate changelog with scope groups for custom commits', async () => {
		expect((await relion({
			changelog: { header: '', partials: { header: '', footer: '' } },
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
		})).generatedChangelog).toMatchSnapshot()
	})

	it('should generate changelog with release changelog URL in footer', async () => {
		expect((await relion({
			changelog: { commitRange: { releaseTag: 'v0.18.0' } },
			context: { footerChangelogUrl: true },
		})).generatedChangelog).toMatchSnapshot()
	})

	it('should generate changelog with selected and modified sections', async () => {
		expect((await relion({ changelog: {
			commitRange: { releaseTag: 'v0.7.0' },
			sections: sectionsSelector.omit('chore', 'docs', 'style', 'perf', 'test', 'misc', 'ci', 'deps')
				.modify('feat', section => ({ ...section, title: '🎁 New Features' })),
		} })).generatedChangelog).toMatchSnapshot()
	})
})

describe('changelog sections rendering', () => {
	it.for([10, 20])('should limit changelog to $0 lines for release v0.17.0', async (maxLines) => {
		expect((await relion({ changelog: {
			commitRange: { releaseTag: 'v0.17.0' },
			maxLinesPerRelease: maxLines,
		} })).generatedChangelog).toMatchSnapshot()
	})

	it('should keep sections with show="always" despite changelog line limit', async () => {
		expect((await relion({
			changelog: { maxLinesPerRelease: 25 },
			context: {
				newVersion: '0.18.0',
				commitHyperlink: false,
				commits: [
					...Array.from({ length: 10 }, () => ({ message: 'feat(core): some feature' })),
					...Array.from({ length: 10 }, () => ({ message: 'fix(core): some bugfix' })),
					...Array.from({ length: 10 }, () => ({ message: 'refactor(core): some refactor' })),
					{ message: 'perf(core): some performance improvement' },
					{ message: 'revert(core): some revert' },
					{ message: 'chore(core): some chore' },
				],
			},
		})).generatedChangelog).toMatchSnapshot()
	})

	it('should keep commits with breaking changes when maxLinesPerRelease is exceeded', async () => {
		expect((await relion({
			changelog: { maxLinesPerRelease: 3 },
			context: {
				newVersion: '0.18.0',
				commitHyperlink: false,
				commits: [
					{ message: 'feat(core): some feature' },
					{ message: 'fix(core): some bugfix' },
					{ message: 'refactor(core): some refactor' },
					{ message: 'perf(core): some performance improvement' },
					{ message: 'revert(core): some revert' },
					{ message: 'chore(core): some chore\n\nBREAKING CHANGE: some breaking change' },
				],
			},
		})).generatedChangelog).toMatchSnapshot()
	})

	it('should skip sections with show="never"', async () => {
		expect((await relion({
			changelog: {
				sections: {
					feat: { title: '🎁 New Features', commitType: 'feat', show: 'always' },
					fix: { title: '🐛 Bug Fixes', commitType: 'fix', show: 'never' },
				},
			},
			context: {
				newVersion: '0.18.0',
				commitHyperlink: false,
				commits: [
					{ message: 'feat(core): some feature' },
					{ message: 'fix(core): some bugfix 1' },
					{ message: 'fix(core): some bugfix 2\n\nBREAKING CHANGE: some breaking change' },
				],
			},
		})).generatedChangelog).toMatchSnapshot()
	})

	it('should only show breaking commits for sections with show="only-breaking"', async () => {
		expect((await relion({
			changelog: {
				sections: { feat: { title: '🎁 New Features', commitType: 'feat', show: 'only-breaking' } },
			},
			context: {
				newVersion: '0.18.0',
				commitHyperlink: false,
				commits: [
					{ message: 'feat(core): some feature 1' },
					{ message: 'feat(core): some feature 2\n\nBREAKING CHANGE: some breaking change' },
				],
			},
		})).generatedChangelog).toMatchSnapshot()
	})

	it('should ignore changelog line limit for the first section when show defaults to "limit-or-breaking"', async () => {
		expect((await relion({
			changelog: {
				maxLinesPerRelease: 1,
				sections: { feat: { title: '🎁 New Features', commitType: 'feat' } },
			},
			context: {
				newVersion: '0.18.0',
				commitHyperlink: false,
				commits: [
					{ message: 'feat(core): some feature 1' },
					{ message: 'feat(core): some feature 2\n\nBREAKING CHANGE: some breaking change' },
					{ message: 'feat(core): some feature 3' },
				],
			},
		})).generatedChangelog).toMatchSnapshot()
	})

	it('should show only breaking commits for sections exceeding line limit when show defaults to "limit-or-breaking"', async () => {
		expect((await relion({
			changelog: {
				maxLinesPerRelease: 1,
				sections: {
					feat: { title: '🎁 New Features', commitType: 'feat' },
					fix: { title: '🐛 Bug Fixes', commitType: 'fix' },
				},
			},
			context: {
				newVersion: '0.18.0',
				commitHyperlink: false,
				commits: [
					{ message: 'feat(core): some feature 1' },
					{ message: 'feat(core): some feature 2\n\nBREAKING CHANGE: some breaking change 1' },
					{ message: 'feat(core): some feature 3' },
					{ message: 'fix(core): some bugfix 1' },
					{ message: 'fix(core): some bugfix 2\n\nBREAKING CHANGE: some breaking change 2' },
				],
			},
		})).generatedChangelog).toMatchSnapshot()
	})
})

describe('commit references rendering', () => {
	const config: UserConfig = {
		changelog: { header: '', partials: { header: '', footer: '' } },
		context: {
			currentVersion: '0.10.0',
			commits: [
				{
					hash: '123456b',
					message: 'feat(core): add new feature\n\nCloses #20\nRefs kh4f/relion#30',
				},
				{
					hash: '123456a',
					message: 'fix(core): fix bug\n\nFixes #10',
				},
			],
		},
	}

	it('should render commit references as hyperlinks', async () => {
		expect((await relion(config)).generatedChangelog).toMatchSnapshot()
	})

	it('should render commit references as plain text', async () => {
		expect((await relion({
			...config,
			context: { ...config.context, commitHyperlink: false, refHyperlink: false },
		})).generatedChangelog).toMatchSnapshot()
	})
})

describe('partials customization', () => {
	it('should generate changelog with customized partials', async () => {
		expect((await relion({
			changelog: {
				commitRange: { releaseTag: 'v0.8.0' },
				header: '',
				partials: {
					header: '',
					main: '',
					customPartial: '**This is a custom partial**',
					footer: 'CUSTOM FOOTER --- {{>customPartial}} ---',
				},
			},
		})).generatedChangelog).toMatchSnapshot()
	})

	it('should generate changelog with transformed partials', async () => {
		expect((await relion({
			changelog: {
				commitRange: { releaseTag: 'v0.8.0' },
				partials: {
					header: fallback => `CUSTOM HEADER---${fallback}---`,
					footer: fallback => `CUSTOM FOOTER---${fallback}---`,
				},
			},
		})).generatedChangelog).toMatchSnapshot()
	})

	it('should generate changelog with transformed footer and custom changelog URL partial', async () => {
		expect((await relion({
			changelog: {
				commitRange: { releaseTag: 'v0.8.0' },
				partials: {
					changelogUrl: '{{repo.homepage}}/blob/main/CHANGELOG.md',
					footer: fallback => fallback.replace('&nbsp; ', '$&[_Release Changelog_]({{>changelogUrl}}) &ensp;•&ensp; '),
				},
			},
		})).generatedChangelog).toMatchSnapshot()
	})
})

describe.runIf(process.env.VITEST_VSCODE)('changelog generation (manual)', () => {
	it('should print upcoming release changelog', async () => {
		await relion({ changelog: true })
	})

	it('should print latest release changelog', async () => {
		await relion({ changelog: { commitRange: 'latest-release' } })
	})

	it('should print changelog for last 5 commits', async () => {
		await relion({ changelog: { commitRange: 'HEAD~5..' } })
	})
})