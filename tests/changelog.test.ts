import { describe, expect, it } from 'vitest'
import relion, { type UserConfig } from '@/.'

const baseConfig: UserConfig = {
	silent: true,
	profile: 'test',
	_test: {
		changelog: {
			output: 'stdout',
		},
	},
}

describe('changelog generation', () => {
	it('should print upcoming release changelog', async () => {
		await relion({ ...baseConfig })
	})

	it('should print latest release changelog', async () => {
		await relion({ ...baseConfig,
			changelog: {
				commitRange: 'latest-release',
			},
		})
	})

	it('should print changelog for last 5 commits', async () => {
		await relion({ ...baseConfig,
			changelog: {
				commitRange: 'HEAD~5..',
			},
		})
	})

	it.for(['v0.7.0', 'v0.8.0'])('should print changelog for release $0', async (versionTag) => {
		const result = await relion({ ...baseConfig,
			changelog: {
				commitRange: { versionTag },
			},
		})
		expect(result.generatedChangelog).toMatchSnapshot()
	})
})