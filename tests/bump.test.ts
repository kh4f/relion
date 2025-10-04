import { describe, expect, it } from 'vitest'
import { readFileSync, writeFileSync } from 'node:fs'
import relion from '@/.'

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