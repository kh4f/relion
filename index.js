import bump, { getNewVersion } from './lib/lifecycles/bump.js';
import changelog from './lib/lifecycles/changelog.js';
import commit from './lib/lifecycles/commit.js';
import fs from 'fs';
import latestSemverTag from './lib/latest-semver-tag.js';
import path from 'path';
import printError from './lib/print-error.js';
import tag from './lib/lifecycles/tag.js';
import { resolveUpdaterObjectFromArgument } from './lib/updaters/index.js';
import defaults from './defaults.js';
import { mergician } from 'mergician';

export default async function ryly(argv) {
	/**
	 * `--message` (`-m`) support will be removed in the next major version.
	 */
	const message = argv.m || argv.message;
	if (message) {
		/**
		 * The `--message` flag uses `%s` for version substitutions, we swap this
		 * for the substitution defined in the config-spec for future-proofing upstream
		 * handling.
		 */
		argv.preset.releaseCommitMessageFormat = message.replace(/%s/g, '{{currentTag}}');
		if (!argv.silent) {
			console.warn(
				'[commit-and-tag-version]: --message (-m) will be removed in the next major release. Use --releaseCommitMessageFormat.',
			);
		}
	}

	if (argv.changelogHeader) {
		argv.preset.header = argv.changelogHeader;
		if (!argv.silent) {
			console.warn(
				'[commit-and-tag-version]: --changelogHeader will be removed in the next major release. Use --header.',
			);
		}
	}

	if (
		argv.preset.header &&
		argv.preset.header.search(changelog.START_OF_LAST_RELEASE_PATTERN) !== -1
	) {
		throw Error(
			`custom changelog header must not match ${changelog.START_OF_LAST_RELEASE_PATTERN}`,
		);
	}

	/**
	 * If an argument for `packageFiles` provided, we include it as a "default" `bumpFile`.
	 */
	if (argv.packageFiles) {
		defaults.bumpFiles = defaults.bumpFiles.concat(argv.packageFiles);
	}

	const args = mergician(defaults, argv);
	let pkg;
	for (const packageFile of args.packageFiles) {
		const updater = await resolveUpdaterObjectFromArgument(packageFile);
		if (!updater) return;
		const pkgPath = path.resolve(process.cwd(), updater.filename);
		try {
			const contents = fs.readFileSync(pkgPath, 'utf8');
			pkg = {
				version: updater.updater.readVersion(contents),
				private:
					typeof updater.updater.isPrivate === 'function'
						? updater.updater.isPrivate(contents)
						: false,
			};
			break;
			// eslint-disable-next-line no-unused-vars
		} catch (err) {
			/* This probably shouldn't be empty? */
		}
	}
	try {
		let version;
		if (pkg && pkg.version) {
			version = pkg.version;
		} else if (args.gitTagFallback) {
			version = await latestSemverTag(args);
		} else {
			throw new Error('no package file found');
		}

		const newVersion = await getNewVersion(args, version);
		args.bump && await bump(args, newVersion);
		args.changelog && await changelog(args, newVersion);
		args.commit && await commit(args, newVersion);
		args.tag && await tag(newVersion, pkg ? pkg.private : false, args);
	} catch (err) {
		printError(args, err.message);
		throw err;
	}
}
