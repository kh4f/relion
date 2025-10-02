import { describe, expect, it } from 'vitest'
import { readFileSync, writeFileSync } from 'node:fs'
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

describe('version bumping', () => {
	it('should bump version in manifest.json', () => {
		const origManifestContent = readFileSync('tests/fixtures/manifest.json', 'utf8')
		relion({
			dryRun: false,
			context: { newVersion: '1.2.3' },
			bump: [{
				file: 'tests/fixtures/manifest.json',
				pattern: /(version": )".*"/,
				replacement: `$1"{{newVersion}}"`,
			}],
		})
		expect(readFileSync('tests/fixtures/manifest.json', 'utf8')).toMatchSnapshot()
		writeFileSync('tests/fixtures/manifest.json', origManifestContent, 'utf8')
	})

	it(`should append new version entry to 'versions.json'`, () => {
		const origVersionsContent = readFileSync('tests/fixtures/versions.json', 'utf8')
		relion({
			dryRun: false,
			context: { newVersion: '1.2.3' },
			bump: [{
				file: 'tests/fixtures/versions.json',
				pattern: /(.*")/s,
				replacement: `$1,\n\t"{{newVersion}}": "${/(^.*?minAppVersion": ")(.*?)(")/s.exec(readFileSync('tests/fixtures/manifest.json', 'utf8'))?.[2]}"`,
			}],
		})
		expect(readFileSync('tests/fixtures/versions.json', 'utf8')).toMatchSnapshot()
		writeFileSync('tests/fixtures/versions.json', origVersionsContent, 'utf8')
	})
})