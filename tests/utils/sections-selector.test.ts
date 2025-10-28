import { describe, expect, it } from 'vitest'
import { sectionsSelector } from '@/utils'

describe('sectionsSelector', () => {
	it('should pick specified sections', () => {
		const selected = sectionsSelector.pick('feat', 'fix')
		expect(selected).toEqual({
			feat: { title: '✨ Features', commitType: 'feat' },
			fix: { title: '🩹 Fixes', commitType: 'fix' },
		})
	})

	it('should omit specified sections', () => {
		const omitted = sectionsSelector.omit('chore', 'docs', 'style', 'refactor', 'perf', 'test', 'misc', 'ci', 'deps', 'omit', 'pick', 'modify')
		console.log(omitted)
		expect(omitted).toEqual({
			breaking: { title: '⚠️ BREAKING CHANGES', commitType: 'breaking' },
			feat: { title: '✨ Features', commitType: 'feat' },
			fix: { title: '🩹 Fixes', commitType: 'fix' },
			revert: { title: '♻️ Reverts', commitType: 'revert' },
			build: { title: '📦 Build', commitType: 'build' },
			types: { title: '🏷️ Types', commitType: 'types' },
		})
	})

	it('should modify feat section title', () => {
		const modified = sectionsSelector.modify('feat', section => ({ ...section, title: '🎁 New Features' }))
		expect(modified.feat).toEqual({ title: '🎁 New Features', commitType: 'feat' })
	})
})