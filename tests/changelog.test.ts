import { describe, expect, it } from 'vitest'
import relion from '@/.'

describe('changelog generation', () => {
	it.for(['v0.7.0', 'v0.8.0'])('should print changelog for release $0', (releaseTag) => {
		expect(relion({ silent: true, dryRun: true,
			changelog: { commitRange: { releaseTag } },
		}).generatedChangelog).toMatchSnapshot()
	})
})

describe.runIf(process.env.VITEST_VSCODE)('manual changelog inspection', () => {
	it('should print upcoming release changelog', () => {
		relion({ changelog: { output: 'stdout' } })
	})

	it('should print latest release changelog', () => {
		relion({ changelog: { output: 'stdout', commitRange: 'latest-release' } })
	})

	it('should print changelog for last 5 commits', () => {
		relion({ changelog: { output: 'stdout', commitRange: 'HEAD~5..' } })
	})
})