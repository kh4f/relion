import { describe, expect, it } from 'vitest'
import relion from '@/.'

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
		expect(relion({ silent: true }).resolvedConfig.context.newTag).toMatch(/^v\d+\.\d+\.\d+/)
	})

	it('should use custom newTagFormat value', () => {
		expect(relion({ silent: true,
			newTagFormat: 'release-{{version}}-beta',
		}).resolvedConfig.context.newTag).toMatch(/^release-\d+\.\d+\.\d+-beta/)
	})

	it('should use custom newTagPrefix value', () => {
		expect(relion({ silent: true,
			newTagPrefix: 'relion@',
		}).resolvedConfig.context.newTag).toMatch(/^relion@\d+\.\d+\.\d+/)
	})

	it('should prefer newTagPrefix over newTagFormat', () => {
		expect(relion({ silent: true,
			newTagPrefix: 'relion@',
			newTagFormat: 'release-{{version}}-beta',
		}).resolvedConfig.context.newTag).toMatch(/^relion@\d+\.\d+\.\d+/)
	})

	it('should use custom newTagPrefix value', () => {
		expect(relion({ silent: true,
			newTagPrefix: 'relion@',
		}).resolvedConfig.context.newTag).toMatch(/^relion@\d+\.\d+\.\d+/)
	})

	it('should prefer newTagPrefix over newTagFormat', () => {
		expect(relion({ silent: true,
			newTagPrefix: 'relion@',
			newTagFormat: 'release-{{version}}-beta',
		}).resolvedConfig.context.newTag).toMatch(/^relion@\d+\.\d+\.\d+/)
	})
})