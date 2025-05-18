const defaultPresetURL = import.meta.resolve('./preset/index.js');

const defaults = {
	bump: false,
	changelog: false,
	commit: false,
	tag: false,
	all: false,

	infile: 'CHANGELOG.md',
	sign: false,
	signoff: false,
	noVerify: false,
	commitAll: false,
	silent: false,
	tagPrefix: 'v',
	releaseCount: 1,
	scripts: {},
	dryRun: false,
	tagForce: false,
	gitTagFallback: true,
	npmPublishHint: undefined,
	packageFiles: ['package.json', 'bower.json', 'manifest.json'],

	context: {
		linkReferences: true,
	},

	preset: {
		name: defaultPresetURL,
		// defaults provided by the spec
		// https://github.com/conventional-changelog/conventional-changelog-config-spec/tree/master/versions/2.2.0
		header: '# Changelog\n\n\n',
		types: [
			{ type: 'feat', section: 'Features' },
			{ type: 'fix', section: 'Bug Fixes' },
			{ type: 'chore', hidden: true },
			{ type: 'docs', hidden: true },
			{ type: 'style', hidden: true },
			{ type: 'refactor', hidden: true },
			{ type: 'perf', hidden: true },
			{ type: 'test', hidden: true },
		],
		/* preMajor value is defined in spec, but should not be in defaults 
		   since it's set to true automatically if version < 1.0.0, 
		   or matches the user config if provided.
		*/
		// preMajor: false,
		commitUrlFormat: '{{host}}/{{owner}}/{{repository}}/commit/{{hash}}',
		compareUrlFormat: '{{host}}/{{owner}}/{{repository}}/compare/{{previousTag}}...{{currentTag}}',
		issueUrlFormat: '{{host}}/{{owner}}/{{repository}}/issues/{{id}}',
		userUrlFormat: '{{host}}/{{user}}',
		releaseCommitMessageFormat: 'chore(release): {{currentTag}}',
		issuePrefixes: ['#'],
	},

	writerOpts: {
		commitsSort: false,
	},
};

defaults.bumpFiles = defaults.packageFiles.concat([
	'package-lock.json',
	'npm-shrinkwrap.json',
]);

export default defaults;
