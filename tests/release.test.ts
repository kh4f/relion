import { describe, expect, it } from 'vitest'
import relion from '@/.'
import { testConfig } from './fixtures/relion.test-config'

describe('release workflow', () => {
	it('should simulate full release workflow', () => {
		relion({
			bump: true,
			changelog: true,
			commit: true,
			tag: true,
			dryRun: true,
		})
	})
})

describe('tag generation', () => {
	it('should use default newTagFormat value', () => {
		expect(relion({ ...testConfig }).resolvedConfig.context.newTag).toMatch(/^v\d+\.\d+\.\d+/)
	})

	it('should use custom newTagFormat value', () => {
		expect(relion({ ...testConfig,
			newTagFormat: 'release-{{version}}-beta',
		}).resolvedConfig.context.newTag).toMatch(/^release-\d+\.\d+\.\d+-beta/)
	})

	it('should use custom newTagPrefix value', () => {
		expect(relion({ ...testConfig,
			newTagPrefix: 'relion@',
		}).resolvedConfig.context.newTag).toMatch(/^relion@\d+\.\d+\.\d+/)
	})

	it('should prefer newTagPrefix over newTagFormat', () => {
		expect(relion({ ...testConfig,
			newTagPrefix: 'relion@',
			newTagFormat: 'release-{{version}}-beta',
		}).resolvedConfig.context.newTag).toMatch(/^relion@\d+\.\d+\.\d+/)
	})
})