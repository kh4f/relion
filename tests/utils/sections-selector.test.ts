import { describe, expect, it } from 'vitest'
import { sectionsSelector } from '@/utils'

describe('changelog sections selector', () => {
	it('should pick specified sections', () => {
		const selected = sectionsSelector.pick('feat', 'fix')
		expect(selected).toEqual({
			feat: { title: '✨ Features', commitType: 'feat', ignoreLimit: true },
			fix: { title: '🩹 Fixes', commitType: 'fix', ignoreLimit: true },
		})
	})

	it('should omit specified sections', () => {
		const omitted = sectionsSelector.omit('chore', 'docs', 'style', 'refactor', 'perf', 'test', 'misc', 'ci', 'deps', 'omit', 'pick', 'modify')
		console.log(omitted)
		expect(omitted).toEqual({
			breaking: { title: '⚠️ BREAKING CHANGES', commitType: 'breaking', ignoreLimit: true },
			feat: { title: '✨ Features', commitType: 'feat', ignoreLimit: true },
			fix: { title: '🩹 Fixes', commitType: 'fix', ignoreLimit: true },
			revert: { title: '♻️ Reverts', commitType: 'revert', ignoreLimit: true },
			build: { title: '📦 Build', commitType: 'build' },
			types: { title: '🏷️ Types', commitType: 'types' },
		})
	})

	it('should modify feat section title', () => {
		const modified = sectionsSelector.modify('feat', section => ({ ...section, title: '🎁 New Features' }))
		expect(modified.feat).toEqual({ title: '🎁 New Features', commitType: 'feat', ignoreLimit: true })
	})
})