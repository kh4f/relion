import { describe, expect, it } from 'vitest'
import relion, { changelogSectionsSelector } from '@/.'

describe('changelog generation', () => {
	it.for(['v0.7.0', 'v0.8.0'])('should generate changelog for release $0', (releaseTag) => {
		expect(relion({ changelog: { commitRange: { releaseTag } } }).generatedChangelog).toMatchSnapshot()
	})

	it.for(['v0.7.0', 'v0.8.0'])('should generate changelog for release $0 without scope groups', (releaseTag) => {
		expect(relion({ changelog: { commitRange: { releaseTag }, groupCommitsByScope: false } }).generatedChangelog).toMatchSnapshot()
	})

	it('should generate changelog with scope groups for custom commits', () => {
		expect(relion({
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
		}).generatedChangelog).toMatchSnapshot()
	})

	it('should generate changelog with release changelog URL in footer', () => {
		expect(relion({
			changelog: { commitRange: { releaseTag: 'v0.18.0' } },
			context: { footerChangelogUrl: true },
		}).generatedChangelog).toMatchSnapshot()
	})

	it('should generate changelog with selected and modified sections', () => {
		expect(relion({ changelog: {
			commitRange: { releaseTag: 'v0.7.0' },
			sections: changelogSectionsSelector.omit('chore', 'docs', 'style', 'perf', 'test', 'misc', 'ci', 'deps')
				.modify('feat', section => ({ ...section, title: '🎁 New Features' })),
		} }).generatedChangelog).toMatchSnapshot()
	})
})

describe('changelog line limit', () => {
	it.for([10, 20])('should limit changelog to $0 lines for release v0.17.0', (maxLines) => {
		expect(relion({ changelog: {
			commitRange: { releaseTag: 'v0.17.0' },
			maxLinesPerRelease: maxLines,
		} }).generatedChangelog).toMatchSnapshot()
	})

	it('should keep sections with ignoreLimit=true despite changelog line limit', () => {
		expect(relion({
			changelog: { maxLinesPerRelease: 25 },
			context: {
				currentVersion: '0.8.0',
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
		}).generatedChangelog).toMatchSnapshot()
	})
})

describe('commit references rendering', () => {
	const config = {
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

	it('should render commit references as hyperlinks', () => {
		expect(relion(config).generatedChangelog).toMatchSnapshot()
	})

	it('should render commit references as plain text', () => {
		expect(relion({
			...config,
			context: { ...config.context, commitHyperlink: false, refHyperlink: false },
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
					customPartial: '**This is a custom partial**',
					footer: 'CUSTOM FOOTER --- {{>customPartial}} ---',
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

	it('should generate changelog with transformed footer and custom changelog URL partial', () => {
		expect(relion({
			changelog: {
				commitRange: { releaseTag: 'v0.8.0' },
				partials: {
					changelogUrl: '{{repo.homepage}}/blob/main/CHANGELOG.md',
					footer: fallback => fallback.replace('&nbsp; ', '$&[_Release Changelog_]({{>changelogUrl}}) &ensp;•&ensp; '),
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