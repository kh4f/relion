import { describe, expect, it } from 'vitest'
import { parseCommit } from '@/utils'

describe('commit parsing', () => {
	it('should parse commit without details', () => {
		expect(parseCommit(
			'refactor(templates): replaces direct newlines with the `br` partial',
		)).toMatchSnapshot()
	})

	it('should parse commit with body', () => {
		expect(parseCommit(
			'refactor(utils): extract `hbs-load-hook` to separate module to avoid registration conflict\n\n'
			+ 'Separated the Handlebars load hook logic into its own module to prevent errors when registering the hook due to prior `.hbs` imports in `hbs-helper`.',
		)).toMatchSnapshot()
	})

	it('should parse commit with multi-line body', () => {
		expect(parseCommit(
			'feat(changelog): add release changelog link to footer template\n\n'
			+ '- Add `tagToUrlFragment` helper to convert tag to changelog URL fragment\n'
			+ '- Add `changelogUrl` partial to generate changelog URL\n'
			+ '- Update release template footer to include "Release Changelog" link\n'
			+ '- Update changelog tests shapshots to reflect new footer format',
		)).toMatchSnapshot()
	})

	it('should parse commit with multi-paragraph body', () => {
		expect(parseCommit(
			'fix(changelog): resolve Handlebars state leakage by using local instance\n\n'
			+ 'Use local Handlebars instance via `Handlebars.create()` to isolate partial registration per invocation. This fixes test failures when running multiple changelog tests together due to globally registered partials leaking between tests.\n\n'
			+ '- Replace global `Handlebars` with local instance in `changelog.ts`\n'
			+ '- Remove `renderTemplate` utility and use `Handlebars.compile()` directly\n'
			+ '- Re-enable 2 previously skipped partial transformation tests\n'
			+ '- Update snapshot for transformed footer test as it was invalid due to partial leakage',
		)).toMatchSnapshot()
	})

	it('should parse commit with footer only', () => {
		expect(parseCommit(
			'revert(config): allow skipping bump for `versionSourceFile` via `!versionSourceFile` in `bump` array\n\n'
			+ 'This reverts commit ba77ad8cf8b0c56dcd5740ab0253c0d1c38fa594.',
		)).toMatchSnapshot()
	})

	it('should parse commit with body and footer', () => {
		expect(parseCommit(
			'ci(release): refine tag pattern for release triggers\n\n'
			+ 'Updated the tag pattern in the workflow to match semantic versioning format \'v[0-9]+.[0-9]+.[0-9]+*\' for more precise release triggers.\n\n'
			+ 'Refs #12',
		)).toMatchSnapshot()
	})
})

describe('footer refs parsing', () => {
	it('should parse commit with a single reference', () => {
		expect(parseCommit(
			'feat(core): add new feature\n\nRefs #10',
		)?.refs).toMatchSnapshot()
	})

	it('should parse commit with external repo reference', () => {
		expect(parseCommit(
			'feat(core): add new feature\n\nRefs kh4f/relion#30',
		)?.refs).toMatchSnapshot()
	})

	it('should parse commit with multiple references', () => {
		expect(parseCommit(
			'feat(core): add new feature\n\nFixes #10\nCloses #20\nRefs kh4f/relion#30',
		)?.refs).toMatchSnapshot()
	})

	// TODO: support multiple references on the same line
	it.todo('should parse commit with multiple references on the same line', () => {
		expect(parseCommit(
			'feat(core): add new feature\n\nFixes #10, Closes #20, Refs kh4f/relion#30',
		)?.refs).toMatchSnapshot()
	})
})