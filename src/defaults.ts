import type { MergedConfig, DefaultVersionedFile, CompleteChangelogOptions, CompleteCommitOptions, CompleteTagOptions, DefaultChangelogSections } from '@/types'

export const defaultConfig: MergedConfig = {
	bump: false,
	changelog: false,
	commit: false,
	tag: false,
	versionSourceFile: './package.json',
	newTagFormat: 'v{{newVersion}}',
	prevReleaseTagPattern: /^v(?<version>\d+\.\d+\.\d+)/,
	zeroMajorBreakingIsMinor: true,
	dryRun: false,
	silent: false,
	context: {
		commitHyperlink: true,
		refHyperlink: true,
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
		refActionPattern: /Fixes|Closes|Refs/i,
		dateSource: 'authorDate',
		dateFormat: 'YYYY-MM-DD',
	},
}

export const defaultChangelogSections: DefaultChangelogSections = {
	breaking: { title: '⚠️ BREAKING CHANGES', commitType: 'breaking' },
	feat: { title: '✨ Features', commitType: 'feat' },
	fix: { title: '🩹 Fixes', commitType: 'fix' },
	perf: { title: '⚡ Performance', commitType: 'perf' },
	refactor: { title: '🚜 Refactoring', commitType: 'refactor' },
	docs: { title: '📚 Documentation', commitType: 'docs' },
	style: { title: '🎨 Formatting', commitType: 'style' },
	build: { title: '📦 Build', commitType: 'build' },
	ci: { title: '🚀 CI', commitType: 'ci' },
	revert: { title: '♻️ Reverts', commitType: 'revert' },
	types: { title: '🏷️ Types', commitType: 'types' },
	deps: { title: '🧩 Dependencies', commitType: 'chore',
		filter: commit => !!commit.scope?.includes('deps') },
	chore: { title: '🛠️ Chores', commitType: 'chore' },
	test: { title: '🧪 Tests', commitType: 'test' },
	misc: { title: '⚙️ Miscellaneous', commitType: '*',
		filter: commit => commit.type !== 'release' },
	[Symbol.iterator]() {
		return Object.values(this)[Symbol.iterator]()
	},
}

export const defaultChangelogOptions: CompleteChangelogOptions = {
	output: 'CHANGELOG.md',
	commitRange: 'unreleased',
	sections: [...defaultChangelogSections],
	header: '# Changelog\n\n\n',
	prevReleaseHeaderPattern: /^##.*?\d+\.\d+\.\d+/m,
	helpers: {
		eq: (a: unknown, b: unknown) => a === b,
		repeat: (string: string, n: number) => string.repeat(n),
	},
	partials: {},
}

export const defaultCommitOptions: CompleteCommitOptions = {
	message: 'release({{repo.name}}): {{newTag}}',
	signOff: false,
	gpgSign: false,
	stageAll: true,
	extraArgs: '',
}

export const defaultTagOptions: CompleteTagOptions = {
	name: '{{newTag}}',
	message: 'release({{repo.name}}): {{newTag}}',
	gpgSign: false,
	force: false,
	extraArgs: '',
}

export const defaultVersionedFiles: DefaultVersionedFile[] = [
	{
		filePathRegex: /package\.json$/,
		versionPattern: /(^.*?"version".*?")(.*?)(")/s,
	},
	{
		filePathRegex: /package-lock\.json$/,
		versionPattern: /(^.*?"version".*?"|"packages".*?"".*"version".*?")(.*?)(")/gs,
	},
]