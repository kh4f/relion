import { describe, it } from 'vitest'
import relion from '@/.'

describe('release workflow', () => {
	it('should simulate full release workflow', async () => {
		await relion({
			bump: true,
			changelog: true,
			commit: true,
			tag: true,
			dryRun: true,
		})
	})
})