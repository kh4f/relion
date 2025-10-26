import { describe, expect, it } from 'vitest'
import { getRawCommits } from '@/utils/git-helpers'

describe('getRawCommits with commitsScope', () => {
	it('should use cwd as default scope when not provided', () => {
		const hashes = getRawCommits('v0.18.0..v0.19.0').map(c => c.hash)
		expect(hashes).toMatchSnapshot()
	})

	it('should filter commits by specific path', () => {
		const hashes = getRawCommits('v0.18.0..v0.19.0', undefined, 'src/utils').map(c => c.hash)
		expect(hashes).toMatchSnapshot()
	})

	it('should filter commits by multiple paths', () => {
		const hashes = getRawCommits('v0.18.0..v0.19.0', undefined, 'src tests').map(c => c.hash)
		expect(hashes).toMatchSnapshot()
	})
})