import { describe, expect, it } from 'vitest'
import relion from '@/.'
import { testConfig } from './fixtures/relion.test-config'

describe('changelog generation', () => {
	it('should print upcoming release changelog', () => {
		relion({ ...testConfig })
	})

	it('should print latest release changelog', () => {
		relion({ ...testConfig,
			changelog: {
				commitRange: 'latest-release',
			},
		})
	})

	it('should print changelog for last 5 commits', () => {
		relion({ ...testConfig,
			changelog: {
				commitRange: 'HEAD~5..',
			},
		})
	})

	it.for(['v0.7.0', 'v0.8.0'])('should print changelog for release $0', (releaseTag) => {
		const result = relion({ ...testConfig,
			changelog: {
				commitRange: { releaseTag },
			},
		})
		expect(result.generatedChangelog).toMatchSnapshot()
	})
})