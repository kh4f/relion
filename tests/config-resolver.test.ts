import { describe, expect, it } from 'vitest'
import { resolveConfig } from '@/utils'

describe('new tag format resolution', () => {
	it('should use default newTagFormat value', () => {
		expect(resolveConfig({ }).context.newTag).toMatch(/^v\d+\.\d+\.\d+/)
	})

	it('should use custom newTagFormat value', () => {
		expect(resolveConfig({
			newTagFormat: 'release-{{version}}-beta',
		}).context.newTag).toMatch(/^release-\d+\.\d+\.\d+-beta/)
	})

	it('should use custom newTagPrefix value', () => {
		expect(resolveConfig({
			newTagPrefix: 'relion@',
		}).context.newTag).toMatch(/^relion@\d+\.\d+\.\d+/)
	})

	it('should prefer newTagPrefix over newTagFormat', () => {
		expect(resolveConfig({
			newTagPrefix: 'relion@',
			newTagFormat: 'release-{{version}}-beta',
		}).context.newTag).toMatch(/^relion@\d+\.\d+\.\d+/)
	})

	it('should not use version prefix if newTagPrefix is empty', () => {
		expect(resolveConfig({
			newTagPrefix: '',
		}).context.newTag).toMatch(/^\d+\.\d+\.\d+/)
	})
})

describe('source version resolution', () => {
	it('should use package.json as default version source', () => {
		expect(resolveConfig({}).versionSource).toBe('versionSourceFile')
	})

	it('should use latest release tag as version source', () => {
		expect(resolveConfig({ versionSource: 'latest-release-tag' }).versionSource).toBe('latest-release-tag')
	})
})