import { describe, expect, it } from 'vitest'
import relion from '@/.'
import { promptToContinue } from '@/utils/prompter'

describe('release workflow', () => {
	it('should simulate full release workflow', async () => {
		await relion({ lifecycle: 'all' })
	})

	it('should prompt user to review changelog', async () => {
		await relion({
			lifecycle: 'all',
			changelog: { file: 'tests/fixtures/CHANGELOG.md', output: 'file', review: true },
		})
		expect(promptToContinue).toHaveBeenCalledOnce()
	})
})