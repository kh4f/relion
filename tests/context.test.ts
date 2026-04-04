import { expect, test } from 'bun:test'

test('commit filtering', () => {
	const commits = `
		feat(cli): add \`-y\` flag to skip confirmation prompts
		fix(cli): skip \`RELEASE.md\` gen and auto-stage with \`-y\` flag
		ci(release): switch npm publish to OIDC authentication
		chore(deps): bump \`tsdown\` from ^0.21.6 to ^0.21.7
		chore(deps)!: update peer dependencies
		build(theme): automate theme generation with variables
		test(bump): update \`resources.rc\` fixture and snapshot
	`.trim().split(/\n\s+/)

	const filters = [/^ci|build|test\(/, /^chore\(deps\)(?!!)/]
	const filtered = commits.filter(c => !filters.some(f => f.test(c)))
	expect(filtered).toEqual([
		'feat(cli): add `-y` flag to skip confirmation prompts',
		'fix(cli): skip `RELEASE.md` gen and auto-stage with `-y` flag',
		'chore(deps)!: update peer dependencies',
	])
})