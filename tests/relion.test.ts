import { describe, expect, it } from 'vitest'
import relion from '@/.'

describe('release workflow', () => {
	it('should simulate full release workflow', () => {
		relion({ bump: true, changelog: true, commit: true, tag: true })
	})
})

describe('tag generation', () => {
	it('should use default newTagFormat value', () => {
		expect(relion({ }).resolvedConfig.context.newTag).toMatch(/^v\d+\.\d+\.\d+/)
	})

	it('should use custom newTagFormat value', () => {
		expect(relion({
			newTagFormat: 'release-{{version}}-beta',
		}).resolvedConfig.context.newTag).toMatch(/^release-\d+\.\d+\.\d+-beta/)
	})

	it('should use custom newTagPrefix value', () => {
		expect(relion({
			newTagPrefix: 'relion@',
		}).resolvedConfig.context.newTag).toMatch(/^relion@\d+\.\d+\.\d+/)
	})

	it('should prefer newTagPrefix over newTagFormat', () => {
		expect(relion({
			newTagPrefix: 'relion@',
			newTagFormat: 'release-{{version}}-beta',
		}).resolvedConfig.context.newTag).toMatch(/^relion@\d+\.\d+\.\d+/)
	})

	it('should not use version prefix if newTagPrefix is empty', () => {
		expect(relion({
			newTagPrefix: '',
		}).resolvedConfig.context.newTag).toMatch(/^\d+\.\d+\.\d+/)
	})
})

describe('source version resolution', () => {
	it('should use package.json as default version source', () => {
		expect(relion({}).resolvedConfig.versionSource).toBe('versionSourceFile')
	})

	it('should use latest release tag as version source', () => {
		expect(relion({ versionSource: 'latest-release-tag' }).resolvedConfig.versionSource).toBe('latest-release-tag')
	})
})