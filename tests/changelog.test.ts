import { beforeAll, describe, expect, it } from 'vitest'
import relion from '@/.'
import { logSpy } from './setup'

describe('changelog generation', () => {
	it.for(['v0.7.0', 'v0.8.0'])('should generate changelog for release $0', (releaseTag) => {
		expect(relion({ changelog: { commitRange: { releaseTag } } }).generatedChangelog).toMatchSnapshot()
	})
})

describe.runIf(process.env.VITEST_VSCODE)('changelog generation (manual)', () => {
	beforeAll(() => logSpy.mockRestore())

	it('should print upcoming release changelog', () => {
		relion({ changelog: true, bump: true })
	})

	it('should print latest release changelog', () => {
		relion({ changelog: { commitRange: 'latest-release' } })
	})

	it('should print changelog for last 5 commits', () => {
		relion({ changelog: { commitRange: 'HEAD~5..' } })
	})
})