import type { MergedConfig, DefaultBumper, CompleteChangelogOptions, CompleteCommitOptions, CompleteTagOptions, TypeGroupsMap } from '@/types'

export const defaultConfig: MergedConfig = {
	bump: false,
	changelog: false,
	commit: false,
	tag: false,
	versionSource: 'versionSourceFile',
	versionSourceFile: './package.json',
	newTagFormat: 'v{{version}}',
	prevReleaseTagPattern: /^v?(?<version>\d+\.\d+\.\d+)/,
	zeroMajorBreakingIsMinor: true,
	dryRun: false,
	logLevel: 'info',
	context: {
		commitHyperlink: true,
		refHyperlink: true,
		footerChangelogUrl: false,
	},
	commitsParser: {
		headerPattern: /^(?<type>\w+)(?:\((?<scope>.+)\))?(?<bang>!)?: (?<subject>.+)/s,
		breakingChangesPattern: /BREAKING CHANGES?:\s*(?<content>.+)/s,
		breakingChangeListPattern: /- (.+)/g,
		tagPattern: /tag: (?<tag>.*?)[,)]/g,
		coAuthorPattern: /Co-authored-by: (?<name>.+?) <(?<email>.+)>/g,
		signerPattern: /Signed-off-by: (?<name>.+?) <(?<email>.+)>/g,
		ghEmailPattern: /^(?:\d+\+)?(?<username>.+)@users\.noreply\.github\.com$/,
		remoteUrlPattern: /^(https:\/\/|git@)(?<host>[^/:]+)[/:](?<owner>.+?)\/(?<name>.+?)(?:\..*)?$/,
		refPattern: /^(?<action>.+?) (?<labels>.+)$/gm,
		refLabelPattern: /(?:(?<owner>\S+?)\/(?<repo>\S+?))?#(?<number>\d+)/g,
		refActionPattern: /^(Fixes|Closes|Refs)/i,
		dateSource: 'authorDate',
		dateFormat: 'US',
		revertCommitBodyPattern: /^This reverts commit (?<hash>.{7})/m,
	},
}

export const defaultChangelogSections = {
	breaking: { title: '⚠️ BREAKING CHANGES', commitType: 'breaking', ignoreLimit: true },
	feat: { title: '✨ Features', commitType: 'feat', ignoreLimit: true },
	fix: { title: '🩹 Fixes', commitType: 'fix', ignoreLimit: true },
	perf: { title: '⚡ Performance', commitType: 'perf', ignoreLimit: true },
	revert: { title: '♻️ Reverts', commitType: 'revert', ignoreLimit: true },
	refactor: { title: '🚜 Refactoring', commitType: 'refactor' },
	build: { title: '📦 Build', commitType: 'build' },
	docs: { title: '📚 Documentation', commitType: 'docs' },
	style: { title: `🎨 Style`, commitType: 'style' },
	test: { title: '🧪 Tests', commitType: 'test' },
	ci: { title: '🚀 CI', commitType: 'ci' },
	types: { title: '🏷️ Types', commitType: 'types' },
	deps: { title: '🧩 Dependencies', commitType: 'chore',
		filter: commit => !!commit.scope?.includes('deps') },
	chore: { title: '🛠️ Chores', commitType: 'chore' },
	misc: { title: '⚙️ Miscellaneous', commitType: '*',
		filter: commit => commit.type !== 'release' },
} as const satisfies TypeGroupsMap

export const defaultChangelogOptions: CompleteChangelogOptions = {
	output: 'CHANGELOG.md',
	commitRange: 'unreleased',
	sections: defaultChangelogSections,
	header: '# Changelog\n\n\n',
	prevReleaseHeaderPattern: /^##.*?\d+\.\d+\.\d+/m,
	groupCommitsByScope: true,
	maxLinesPerRelease: 20,
	helpers: {
		eq: (a: unknown, b: unknown) => a === b,
		repeat: (string: string, n: number) => string.repeat(n),
		isArray: (value: unknown) => Array.isArray(value),
		isSingle: (arr: unknown[]) => arr.length === 1,
		or: (...args: unknown[]) => args.slice(0, -1).some(Boolean),
		not: (value: unknown) => !value,
		tagToUrlFragment: (tag: string) => `--${tag.replace(' ', '-').replace(/\./g, '')}-`,
	},
	partials: {
		br: '\n',
		scope: '{{#if scope}}**{{scope}}**: {{/if}}',
		commit: `{{{subject}}} {{" "}}
			{{~#if @root.commitHyperlink~}}
				[\`{{hash}}\`]({{@root.repo.homepage}}/commit/{{hash}})
			{{~else~}}
				{{hash}}
			{{~/if~}}
			{{~#if breakingChanges}} ⚠️<sup>[{{breakingChangeIndex}}]</sup>{{/if}}
			{{~#if refs}} {{>refs}}{{/if}}`,
		compareLink: `{{repo.homepage~}}
			{{#if prevRelease.tag~}}
				/compare/{{prevRelease.tag}}...
			{{~else~}}
				/commits/
			{{~/if}}
			{{~tag}}`,
		refs: `({{#each refs~}}
				{{#if @root.refHyperlink~}}
					[{{raw}}]({{@root.repo.homepage}}/issues/{{number}})
				{{~else~}}
					{{raw}}
				{{~/if}}
				{{~#if @last}}){{else}}, {{/if}}
			{{~/each}}`,
		changelogUrl: '{{repo.homepage}}/blob/main/CHANGELOG.md#{{tagToUrlFragment tag}}',
		breakingChangesIndicator: `<sup>[{{breakingChangeIndex}}]</sup>`,
	},
}

export const defaultCommitOptions: CompleteCommitOptions = {
	message: 'release({{repo.name}}): {{newTag}}',
	signOff: false,
	gpgSign: false,
	stageAll: true,
	extraArgs: null,
}

export const defaultTagOptions: CompleteTagOptions = {
	name: '{{newTag}}',
	message: 'release({{repo.name}}): {{newTag}}',
	gpgSign: false,
	force: false,
	extraArgs: null,
}

export const defaultBumpers: DefaultBumper[] = [
	{
		file: /package\.json$/,
		pattern: /(^.*?"version".*?")(.*?)(")/s,
		replacement: '$1{{newVersion}}$3',
	},
	{
		file: /package-lock\.json$/,
		pattern: /(^.*?"version".*?"|"packages".*?"".*"version".*?")(.*?)(")/gs,
		replacement: '$1{{newVersion}}$3',
	},
]