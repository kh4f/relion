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
			newTagPrefix: 'tag-prefix-1',
			_profile1: { newTagPrefix: 'tag-prefix-2' },
			_profile2: { newTagPrefix: 'tag-prefix-3' },
		}).newTagPrefix).toBe('tag-prefix-1')
	})

	it('should use default profile when explicitly specified', () => {
		expect(resolveConfig({
			profile: 'default',
			newTagPrefix: 'tag-prefix-1',
			_default: { newTagPrefix: 'tag-prefix-2' },
		}).newTagPrefix).toBe('tag-prefix-2')
	})

	it('should use default profile when present, even if not specified explicitly', () => {
		expect(resolveConfig({
			newTagPrefix: 'tag-prefix-1',
			_default: { newTagPrefix: 'tag-prefix-2' },
		}).newTagPrefix).toBe('tag-prefix-2')
	})

	it('should use specified profile instead of default one', () => {
		expect(resolveConfig({
			profile: 'profile2',
			newTagPrefix: 'tag-prefix-1',
			_default: { newTagPrefix: 'tag-prefix-2' },
			_profile2: { newTagPrefix: 'tag-prefix-3' },
		}).newTagPrefix).toBe('tag-prefix-3')
	})

	it('should throw error when non-existing profile is specified', () => {
		expect(() => resolveConfig({
			profile: 'profile1',
			newTagPrefix: 'tag-prefix-1',
		})).toThrow('Profile "profile1" not found in configuration.')
	})

	it(`should throw error when default profile is explicitly specified but doesn't exist`, () => {
		expect(() => resolveConfig({
			profile: 'default',
			newTagPrefix: 'tag-prefix-1',
		})).toThrow('Profile "default" not found in configuration.')
	})
})

describe('packageName resolution', () => {
	it('should resolve packageName from package.json', () => {
		expect(resolveConfig({}).context.packageName).toBe('relion')
	})

	it('should use packageName from context if provided', () => {
		expect(resolveConfig({
			context: { packageName: 'custom-package' },
		}).context.packageName).toBe('custom-package')
	})

	it('should throw if package.json is missing in cwd', () => {
		const originalCwd = process.cwd()
		process.chdir(`${import.meta.filename}/..`)
		expect(() => resolveConfig({}).context.packageName).toThrow('ENOENT: no such file or directory')
		process.chdir(originalCwd)
	})
})