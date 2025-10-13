import { describe, expect, it } from 'vitest'
import relion from '@/.'
import { promptToContinue } from '@/utils/prompter'

describe('release workflow', () => {
	it('should simulate full release workflow', async () => {
		await relion({ bump: true, changelog: true, commit: true, tag: true })
	})

	it('should prompt user to review changelog', async () => {
		await relion({
			bump: true, commit: true, tag: true,
			changelog: { output: 'tests/fixtures/CHANGELOG.md', review: true },
		})
		expect(promptToContinue).toHaveBeenCalledOnce()
	})
})