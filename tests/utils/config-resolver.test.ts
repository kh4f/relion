import { describe, expect, it } from 'vitest'
import { resolveConfig } from '@/utils'
import { DEFAULT_RELEASE_TAG_PATTERN } from '@/defaults'

describe('new tag format resolution', () => {
	it('should use default tagFormat value', () => {
		expect(resolveConfig({ }).context.newTag).toMatch(/^v\d+\.\d+\.\d+/)
	})

	it('should use custom tagFormat value', () => {
		expect(resolveConfig({
			tagFormat: 'release-{{version}}-beta',
			context: { newVersion: '0.27.0', commits: [] },
		}).context.newTag).toMatch(/^release-\d+\.\d+\.\d+-beta/)
	})

	it('should use custom tagPrefix value', () => {
		expect(resolveConfig({
			tagPrefix: 'relion@',
			context: { newVersion: '0.27.0', commits: [] },
		}).context.newTag).toMatch(/^relion@\d+\.\d+\.\d+/)
	})

	it('should prefer tagPrefix over tagFormat', () => {
		expect(resolveConfig({
			tagPrefix: 'relion@',
			tagFormat: 'release-{{version}}-beta',
			context: { newVersion: '0.27.0', commits: [] },
		}).context.newTag).toMatch(/^relion@\d+\.\d+\.\d+/)
	})

	it('should not use version prefix if tagPrefix is empty', () => {
		expect(resolveConfig({
			tagPrefix: '',
			context: { newVersion: '0.27.0', commits: [] },
		}).context.newTag).toMatch(/^\d+\.\d+\.\d+/)
	})
})

describe('source version resolution', () => {
	it('should use manifest file as default version source', () => {
		expect(resolveConfig({}).versionSource).toBe('manifestFile')
	})

	it('should use latest release tag as version source', () => {
		expect(resolveConfig({ versionSource: 'latest-release-tag' }).versionSource).toBe('latest-release-tag')
	})
})

describe('commits resolution', () => {
	const revertCommit = {
		hash: 'def4567',
		type: 'revert',
		subject: 'add new feature',
		body: 'This reverts commit abc1234.',
	}

	const originalCommit = {
		hash: 'abc1234',
		type: 'feat',
		subject: 'add new feature',
	}

	it('should filter out both reverted and revert commit if they are in the same release', () => {
		expect(resolveConfig({
			context: {
				commits: [
					{ ...revertCommit, associatedReleaseTag: 'v0.18.0' },
					{ ...originalCommit, associatedReleaseTag: 'v0.18.0' },
				],
			},
		}).context.commits).toMatchInlineSnapshot(`[]`)
	})

	it('should keep both revert and reverted commit if they are in different releases', () => {
		expect(resolveConfig({
			context: {
				commits: [
					{ ...revertCommit, associatedReleaseTag: 'v0.19.0' },
					{ ...originalCommit, associatedReleaseTag: 'v0.18.0' },
				],
			},
		}).context.commits).toMatchInlineSnapshot(`
            [
              {
                "associatedReleaseTag": "v0.19.0",
                "body": "This reverts commit abc1234.",
                "breakingChangeIndex": undefined,
                "hash": "def4567",
                "isReverted": null,
                "subject": "add new feature",
                "type": "revert",
              },
              {
                "associatedReleaseTag": "v0.18.0",
                "breakingChangeIndex": undefined,
                "hash": "abc1234",
                "isReverted": "inOtherRelease",
                "subject": "add new feature",
                "type": "feat",
              },
            ]
        `)
	})
})

describe('config profiles resolution', () => {
	it('should use base config when no profile is specified', () => {
		expect(resolveConfig({
			tagPrefix: 'tag-prefix-1',
			context: { newVersion: '0.27.0', commits: [] },
			_profile1: { tagPrefix: 'tag-prefix-2' },
			_profile2: { tagPrefix: 'tag-prefix-3' },
		}).tagPrefix).toBe('tag-prefix-1')
	})

	it('should use default profile when explicitly specified', () => {
		expect(resolveConfig({
			profile: 'default',
			tagPrefix: 'tag-prefix-1',
			context: { newVersion: '0.27.0', commits: [] },
			_default: { tagPrefix: 'tag-prefix-2' },
		}).tagPrefix).toBe('tag-prefix-2')
	})

	it('should use default profile when present, even if not specified explicitly', () => {
		expect(resolveConfig({
			tagPrefix: 'tag-prefix-1',
			context: { newVersion: '0.27.0', commits: [] },
			_default: { tagPrefix: 'tag-prefix-2' },
		}).tagPrefix).toBe('tag-prefix-2')
	})

	it('should use specified profile instead of default one', () => {
		expect(resolveConfig({
			profile: 'profile2',
			tagPrefix: 'tag-prefix-1',
			context: { newVersion: '0.27.0', commits: [] },
			_default: { tagPrefix: 'tag-prefix-2' },
			_profile2: { tagPrefix: 'tag-prefix-3' },
		}).tagPrefix).toBe('tag-prefix-3')
	})

	it('should throw error when non-existing profile is specified', () => {
		expect(() => resolveConfig({
			profile: 'profile1',
			tagPrefix: 'tag-prefix-1',
			context: { newVersion: '0.27.0', commits: [] },
		})).toThrow('Profile "profile1" not found in configuration.')
	})

	it(`should throw error when default profile is explicitly specified but doesn't exist`, () => {
		expect(() => resolveConfig({
			profile: 'default',
			tagPrefix: 'tag-prefix-1',
			context: { newVersion: '0.27.0', commits: [] },
		})).toThrow('Profile "default" not found in configuration.')
	})
})

describe('package info resolution', () => {
	it('should extract package info from manifest file', () => {
		expect(resolveConfig({
			manifestFile: 'tests/fixtures/package.json',
		}).context.package).toEqual({ name: 'relion', version: '0.17.0', homepage: 'https://github.com/kh4f/relion#readme' })
	})

	it('should extract package info from manifest file using custom pattern', () => {
		expect(resolveConfig({
			manifestFile: {
				file: 'tests/fixtures/package.json',
				pattern: /(^.*?"name": "(?<name>.*?)".*"version": ")(?<version>.*?)(")/s,
				replacement: '$1{{newVersion}}$4',
			},
		}).context.package).toEqual({ name: 'relion', version: '0.17.0' })
	})

	it('should use package info from context if provided', () => {
		expect(resolveConfig({
			context: { package: { name: 'custom-package', version: '1.2.3', extraInfo: 'some-info', homepage: 'https://custom-package.com' } },
		}).context.package).toEqual({ name: 'custom-package', version: '1.2.3', extraInfo: 'some-info', homepage: 'https://custom-package.com' })
	})

	it('should throw if manifest file is missing', () => {
		expect(() => resolveConfig({
			manifestFile: 'foo/package.json',
		})).toThrow('ENOENT: no such file or directory')
	})
})

describe('prevReleaseTagPattern resolution', () => {
	it('should use tagFormat as default prevReleaseTagPattern when not explicitly set', () => {
		const resolvedConfig = resolveConfig({})
		expect(resolvedConfig.prevReleaseTagPattern).toEqual(new RegExp('^' + resolvedConfig.tagFormat.replace('{{version}}', DEFAULT_RELEASE_TAG_PATTERN.source)))
	})

	it('should use explicitly provided prevReleaseTagPattern', () => {
		expect(resolveConfig({
			prevReleaseTagPattern: /prevTag@(?<version>\d+\.\d+\.\d+)/,
			context: { newVersion: '0.27.0', commits: [] },
		}).prevReleaseTagPattern).toEqual(/prevTag@(?<version>\d+\.\d+\.\d+)/)
	})

	it('should resolve prevReleaseTagPattern from tagFormat', () => {
		expect(resolveConfig({
			tagFormat: 'package@{{version}}',
			context: { newVersion: '0.27.0', commits: [] },
		}).prevReleaseTagPattern).toEqual(new RegExp('^package@' + DEFAULT_RELEASE_TAG_PATTERN.source))
	})

	it('should resolve prevReleaseTagPattern from tagPrefix', () => {
		expect(resolveConfig({
			tagPrefix: 'package@',
			context: { newVersion: '0.27.0', commits: [] },
		}).prevReleaseTagPattern).toEqual(new RegExp('^package@' + DEFAULT_RELEASE_TAG_PATTERN.source))
	})
})