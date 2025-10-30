import type { MergedConfig, DefaultBumper, CompleteChangelogOptions, CompleteCommitOptions, CompleteTagOptions, TypeGroupsMap } from '@/types'
import type { HelperOptions } from 'handlebars'

export const DEFAULT_RELEASE_TAG_PATTERN = /(?<version>\d+\.\d+\.\d+.*)/

export const defaultChangelogSections = {
	breaking: { title: '⚠️ BREAKING CHANGES', commitType: 'breaking' },
	feat: { title: '✨ Features', commitType: 'feat' },
	fix: { title: '🩹 Fixes', commitType: 'fix' },
	perf: { title: '⚡ Performance', commitType: 'perf' },
	revert: { title: '♻️ Reverts', commitType: 'revert' },
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
		filter: commit => commit.type !== 'release' && commit.scope !== 'release' },
} as const satisfies TypeGroupsMap

export const defaultChangelogOptions: CompleteChangelogOptions = {
	file: 'CHANGELOG.md',
	output: 'file',
	commitRange: 'unreleased',
	extractFromFile: false,
	sections: defaultChangelogSections,
	header: '# Changelog\n\n\n',
	releasePattern: /(?<header>## [^\n]*?\[[^\n]*?{{version}}[^\n]*?\].*?\n+)(?<body>.*?)(?<footer>##### .*?(?:\n+|$))/s,
	commitRefLinkPattern: /\[`?(#?\w+?)`?\]\(.+?\)/g,
	groupCommitsByScope: true,
	review: false,
	helpers: {
		eq: (a: unknown, b: unknown) => a === b,
		repeat: (string: string, n: number) => string.repeat(n),
		isArray: (value: unknown) => Array.isArray(value),
		isSingle: (arr: unknown[]) => arr.length === 1,
		or: (...args: unknown[]) => args.slice(0, -1).some(Boolean),
		not: (value: unknown) => !value,
		tagToUrlFragment: (tag: string) => `--${tag.replace(' ', '-').replace(/(\.|@)/g, '')}-`,
		getChangelogUrl: (homepage: string) => {
			let url = homepage.replace(/#.*/, '')
			if (!url.includes('/blob/main')) url += '/blob/main'
			return `${url}/CHANGELOG.md`
		},
		toSentenceCase: function (this: unknown, options: HelperOptions) {
			const content = options.fn(this)
			return `${content.charAt(0).toUpperCase()}${content.slice(1)}${content.endsWith('.') ? '' : '.'}`
		},
	},
	partials: {
		br: '\n',
		scope: '{{#if scope}}**{{scope}}**: {{/if}}',
		commit: `{{{subject}}} {{" "}}
			{{~#if @root.commitRefLinks~}}
				[\`{{hash}}\`]({{@root.repo.homepage}}/commit/{{hash}})
			{{~else~}}
				{{hash}}
			{{~/if~}}
			{{~#if breakingChanges}} ⚠️{{>breakingChangesIndicator}}{{/if}}
			{{~#if refs}} {{>refs}}{{/if}}`,
		compareLink: `{{repo.homepage~}}
			{{#if prevRelease.tag~}}
				/compare/{{prevRelease.tag}}...
			{{~else~}}
				/commits/
			{{~/if}}
			{{~tag}}`,
		refs: `({{#each refs~}}
				{{#if @root.commitRefLinks~}}
					[{{raw}}]({{@root.repo.homepage}}/issues/{{number}})
				{{~else~}}
					{{raw}}
				{{~/if}}
				{{~#if @last}}){{else}}, {{/if}}
			{{~/each}}`,
		changelogUrl: '{{getChangelogUrl package.homepage}}',
		releaseChangelogUrl: '{{>changelogUrl}}#{{tagToUrlFragment tag}}',
		breakingChangesIndicator: `<sup>[{{breakingChangeIndex}}]</sup>`,
	},
}

export const defaultCommitOptions: CompleteCommitOptions = {
	message: 'chore(release): {{newTag}}',
	signOff: false,
	gpgSign: false,
	stageAll: true,
	extraArgs: null,
}

export const defaultTagOptions: CompleteTagOptions = {
	name: '{{newTag}}',
	message: '{{commitMessage}}',
	gpgSign: false,
	force: false,
	extraArgs: null,
}

export const defaultManifestFiles: DefaultBumper[] = [
	{
		file: /package\.json$/,
		pattern: /(^.*?"name": "(?<name>.*?)".*"version": ")(?<version>.*?)(".*?"homepage": "(?<homepage>.*?)")/s,
		replacement: '$1{{newVersion}}$4',
	},
]

export const defaultBumpers: DefaultBumper[] = [
	...defaultManifestFiles,
	{
		file: /package-lock\.json$/,
		pattern: /(^.*?"version": "|"packages".*?"".*"version": ")(.*?)(")/gs,
		replacement: '$1{{newVersion}}$3',
	},
]

export const defaultConfig: MergedConfig = {
	lifecycle: ['bump', 'changelog', 'commit', 'tag'],
	bump: ['package.json'],
	versionSource: 'manifestFile',
	manifestFile: './package.json',
	tagFormat: 'v{{version}}',
	commitsScope: '.',
	prevReleaseTagPattern: '{{newTagFormat}}',
	zeroMajorBreakingIsMinor: true,
	dryRun: false,
	logLevel: 'info',
	context: { commitRefLinks: true, footerChangelogUrl: false, isMonorepo: false },
	commitsParser: {
		headerPattern: /^(?<type>\w+)(?:\((?<scope>.+)\))?(?<bang>!)?: (?<subject>.+)/s,
		breakingChangesPattern: /^BREAKING CHANGES?:\s*(?<content>.+)/ms,
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