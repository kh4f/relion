# Changelog


## &ensp; [` 📦 v0.10.0  `](https://github.com/kh4f/relion/compare/v0.9.0...v0.10.0)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⚠️ BREAKING CHANGES
- The `from` and `to` properties have been removed from commit range configuration. Use string-based commit ranges instead.

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✨ Features
- **commits-parser**: add support for predefined 'US' and 'ISO' date formats [`74f7891`](https://github.com/kh4f/relion/commit/74f7891)
- **templates**: add support for array-based breaking changes [`6cb69bb`](https://github.com/kh4f/relion/commit/6cb69bb)
- **commit**: add `releaseTag` property to parsed commits [`ad9d34e`](https://github.com/kh4f/relion/commit/ad9d34e)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🩹 Fixes
- **git-utils**: wrap `from^!` in quotes to prevent shell parsing issues [`163ac1c`](https://github.com/kh4f/relion/commit/163ac1c)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🚜 Refactoring
- **defaults**: change `dateFormat` from 'YYYY-MM-DD' to 'US' [`4e84690`](https://github.com/kh4f/relion/commit/4e84690)
- **git-utils**: replace `from` and `to` properties with string-based commit range [`a15b362`](https://github.com/kh4f/relion/commit/a15b362)
- **config-resolver**: rename `groupCommitsBySections` to `groupCommitsByType` [`f7b996f`](https://github.com/kh4f/relion/commit/f7b996f)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🎨 Style
- **templates**: adjust spacing in footer [`8cbda21`](https://github.com/kh4f/relion/commit/8cbda21)
- **templates**: improve spacing and readability for footer [`2c1e7f8`](https://github.com/kh4f/relion/commit/2c1e7f8)
- **templates**: replace asterisk with dash for commit list items [`2738df7`](https://github.com/kh4f/relion/commit/2738df7)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🏷️ Types
- **commit**: update `isReverted` type to use `NonNullable` [`6c63064`](https://github.com/kh4f/relion/commit/6c63064)
- **commit**: use `undefined` instead of `null` for `associatedReleaseTag` property [`fc09940`](https://github.com/kh4f/relion/commit/fc09940)
- **changelog**: rename `ReleaseWithGroupedCommits` to `ReleaseWithTypeGroups` [`5bc42d9`](https://github.com/kh4f/relion/commit/5bc42d9)
- **changelog**: rename `ResolvedChangelogSectionsMap` to `FilledTypeGroupMap` [`25ed5ab`](https://github.com/kh4f/relion/commit/25ed5ab)
- **changelog**: rename `ResolvedChangelogSection` to `FilledTypeGroup` [`be7c4b1`](https://github.com/kh4f/relion/commit/be7c4b1)
- **changelog**: rename `ChangelogSectionsMap` to `TypeGroupsMap` [`3a82288`](https://github.com/kh4f/relion/commit/3a82288)
- **changelog**: rename `ChangelogSectionDefinition` to `TypeGroupDefinition` [`593f478`](https://github.com/kh4f/relion/commit/593f478)

##### &emsp;&ensp;&nbsp;&nbsp; [_All Release Commits_](https://github.com/kh4f/relion/compare/v0.9.0...v0.10.0) &ensp;•&ensp; _Sep 14, 2025_


## &ensp; [` 📦 v0.9.0  `](https://github.com/kh4f/relion/compare/v0.8.0...v0.9.0)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✨ Features
* **commits-parser**: add synthetic hash generation for commits without `hash` property [`99dacf0`](https://github.com/kh4f/relion/commit/99dacf0)
* **commit**: add `isReverted` status for commit reversion detection [`96f8a9f`](https://github.com/kh4f/relion/commit/96f8a9f)
* **commits-parser**: add `associatedReleaseTag` property to parsed commits [`e39b45a`](https://github.com/kh4f/relion/commit/e39b45a)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🩹 Fixes
* **config-resolver**: filter out empty release groups in `groupCommitsByReleases` [`bc9c482`](https://github.com/kh4f/relion/commit/bc9c482)
* **git-utils**: include `from` commit in commit range by default [`21269f7`](https://github.com/kh4f/relion/commit/21269f7)
* **git-utils**: swap `from` and `to` assignment logic in `getRawCommits` [`cb91e2e`](https://github.com/kh4f/relion/commit/cb91e2e)
* **config-resolver**: prevent undefined entries in parsed commits [`f0293f7`](https://github.com/kh4f/relion/commit/f0293f7)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⚡ Performance
* **commits-parser**: add parsed commits caching [`c94fc63`](https://github.com/kh4f/relion/commit/c94fc63)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🚜 Refactoring
* **templates**: wrap footer in partial block as failover content [`c5fbbbb`](https://github.com/kh4f/relion/commit/c5fbbbb)
* **changelog**: change `commitTypeGroups` from array to object in `ReleaseWithGroupedCommits` [`ec97fc6`](https://github.com/kh4f/relion/commit/ec97fc6)
* **config-resolver**: extract commit resolution logic into dedicated `resolveCommits` function [`35c2b9b`](https://github.com/kh4f/relion/commit/35c2b9b)
* **config-resolver**: simplify commit grouping by release tag [`313aae6`](https://github.com/kh4f/relion/commit/313aae6)
* **commits-parser**: change return type of `parseCommit` to `null` [`748f87f`](https://github.com/kh4f/relion/commit/748f87f)
* **commits-parser**: extract single commit parsing to `parseCommit` function [`ca0f59e`](https://github.com/kh4f/relion/commit/ca0f59e)
* **config-resolver**: rename `latestReleaseTag` to `nearestReleaseTag` [`c4a6641`](https://github.com/kh4f/relion/commit/c4a6641)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🏷️ Types
* **commit**: rename `Commit` to `ParsedCommit` [`2bd8e26`](https://github.com/kh4f/relion/commit/2bd8e26)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🛠️ Chores
* **package**: specify `index` file for `vitest` test script [`991d331`](https://github.com/kh4f/relion/commit/991d331)
* **gitignore**: add `temp.test.ts` to ignored files [`f1a8834`](https://github.com/kh4f/relion/commit/f1a8834)

##### &emsp;&ensp;&nbsp;&nbsp; [_All Release Commits_](https://github.com/kh4f/relion/compare/v0.8.0...v0.9.0) &ensp;•&ensp; _2025-09-13_


## &ensp; [` 📦 v0.8.0  `](https://github.com/kh4f/relion/compare/v0.7.0...v0.8.0)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⚠️ BREAKING CHANGES
* **utils**: The `defaultChangelogSections` export has been removed from the public API. Use `changelogSectionsSelector` instead, which provides the same sections plus `pick` and `omit` methods. [`3febcbc`](https://github.com/kh4f/relion/commit/3febcbc)
* **changelog**: The `sections` option in changelog configuration is now an object with section IDs as keys instead of an array. [`349fed9`](https://github.com/kh4f/relion/commit/349fed9)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✨ Features
* **utils**: add `changelogSectionsSelector` with `pick` and `omit` methods [`3febcbc`](https://github.com/kh4f/relion/commit/3febcbc)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🚜 Refactoring
* **changelog**: change `sections` from array to object format for better usability [`349fed9`](https://github.com/kh4f/relion/commit/349fed9)
* **changelog**: rename `commitGroups` property to `commitTypeGroups` [`6ec89a8`](https://github.com/kh4f/relion/commit/6ec89a8)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🏷️ Types
* **defaults**: use `satisfies ChangelogSectionsMap` for `defaultChangelogSections` [`4343e6f`](https://github.com/kh4f/relion/commit/4343e6f)

##### &emsp;&ensp;&nbsp;&nbsp; [_All Release Commits_](https://github.com/kh4f/relion/compare/v0.7.0...v0.8.0) &ensp;•&ensp; _2025-09-12_


## &ensp; [` 📦 v0.7.0  `](https://github.com/kh4f/relion/compare/v0.6.0...v0.7.0)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✨ Features
* **core**: add `defaultChangelogSections` export [`86da78a`](https://github.com/kh4f/relion/commit/86da78a)
* **changelog**: extend section definitions with optional `id` property [`41c838a`](https://github.com/kh4f/relion/commit/41c838a)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🚜 Refactoring
* **templates**: use `id` property instead of `commitType` for breaking changes condition [`205b9f8`](https://github.com/kh4f/relion/commit/205b9f8)
* **defaults**: update `prevReleaseTagPattern` regex to allow optional leading `v` [`1c631eb`](https://github.com/kh4f/relion/commit/1c631eb)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;📚 Documentation
* **commit-naming**: update commit message guidelines with clarified rules and examples [`94ca4fc`](https://github.com/kh4f/relion/commit/94ca4fc)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🎨 Style
* **changelog**: update title for default `style` section from 'Formatting' to 'Style' [`d47d472`](https://github.com/kh4f/relion/commit/d47d472)
* **templates**: remove emoji from footer commit link [`7ea3c1d`](https://github.com/kh4f/relion/commit/7ea3c1d)
* **templates**: update release footer with italic link and `•` separator [`7e56b38`](https://github.com/kh4f/relion/commit/7e56b38)
* **templates**: simplify release footer by omitting `prevTag → tag` [`df84af2`](https://github.com/kh4f/relion/commit/df84af2)
* **templates**: update footer link label to 'All Release Commits' [`2ca80a6`](https://github.com/kh4f/relion/commit/2ca80a6)
* **templates**: update commit scope formatting to bold with colon [`37dcb53`](https://github.com/kh4f/relion/commit/37dcb53)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🛠️ Chores
* **renovate**: add initial configuration for Renovate [`bc296e9`](https://github.com/kh4f/relion/commit/bc296e9)

##### &emsp;&ensp;&nbsp;&nbsp; [_All Release Commits_](https://github.com/kh4f/relion/compare/v0.6.0...v0.7.0) &ensp;•&ensp; _2025-09-11_


## &ensp; [` 📦 v0.6.0  `](https://github.com/kh4f/relion/compare/v0.5.0...v0.6.0)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✨ Features
* `changelog` add `types` to default changelog sections [`a0d37de`](https://github.com/kh4f/relion/commit/a0d37de)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🩹 Fixes
* `changelog` use `breakingChanges` property instead of `subject` for BREAKING CHANGES section [`d975690`](https://github.com/kh4f/relion/commit/d975690)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;📚 Documentation
* `copilot` add `types` to commit types list and example [`6857cf3`](https://github.com/kh4f/relion/commit/6857cf3)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🚀 CI
* `release` enable silent mode for `pnpm release:github` command [`1fd0b6b`](https://github.com/kh4f/relion/commit/1fd0b6b)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🏷️ Types
* `changelog` extend `ResolvedChangelogSection` from `ChangelogSectionDefinition` [`2cc0aad`](https://github.com/kh4f/relion/commit/2cc0aad)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🧪 Tests
* `cli` change unnecessary `-d` to `-L` flag for generating latest release [`02cb36b`](https://github.com/kh4f/relion/commit/02cb36b)

##### &emsp;&ensp;&nbsp; 🔗 [Full Commit History: `v0.5.0` → `v0.6.0`](https://github.com/kh4f/relion/compare/v0.5.0...v0.6.0) &ensp;/&ensp; _2025-09-09_


## &ensp; [` 📦 v0.5.0  `](https://github.com/kh4f/relion/compare/v0.4.0...v0.5.0)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⚠️ BREAKING CHANGES
* `changelog` replace `stdout` and `outputFile` options with unified `output` [`00d6ff4`](https://github.com/kh4f/relion/commit/00d6ff4)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✨ Features
* `config` add silent mode to suppress console output [`4bd9334`](https://github.com/kh4f/relion/commit/4bd9334)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🩹 Fixes
* `core` handle `silent` setting from profile config [`8107bd6`](https://github.com/kh4f/relion/commit/8107bd6)
* `cli` handle undefined `argv` when `--help` is passed [`a662f9c`](https://github.com/kh4f/relion/commit/a662f9c)
* `git-utils` include release tag in commit range for latest release [`b6db5b2`](https://github.com/kh4f/relion/commit/b6db5b2)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🚜 Refactoring
* `changelog` replace `stdout` and `outputFile` options with unified `output` [`00d6ff4`](https://github.com/kh4f/relion/commit/00d6ff4)
* `utils` move `deepLog` function to `logger.ts` module [`da665c4`](https://github.com/kh4f/relion/commit/da665c4)
* `cli` move CLI logic in `runCli` exported function [`3cdc734`](https://github.com/kh4f/relion/commit/3cdc734)
* `defaults` exclude release commits from `Miscellaneous` changelog section by default [`e4e2545`](https://github.com/kh4f/relion/commit/e4e2545)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🚀 CI
* `release` streamline release notes generation [`51c2f52`](https://github.com/kh4f/relion/commit/51c2f52)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;♻️ Reverts
* `release` update import path for `defineConfig` in relion config [`85884fd`](https://github.com/kh4f/relion/commit/85884fd)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🧩 Dependencies
* `dev-deps` add `tsx` to devDependencies [`b032984`](https://github.com/kh4f/relion/commit/b032984)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🛠️ Chores
* `release` enable silent mode for github profile [`2715333`](https://github.com/kh4f/relion/commit/2715333)
* `release` update changelog output option to new format [`1092648`](https://github.com/kh4f/relion/commit/1092648)
* `release` update import path for `defineConfig` in relion config [`1102afe`](https://github.com/kh4f/relion/commit/1102afe)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🧪 Tests
* `changelog` add test to print only changelog to console [`8139725`](https://github.com/kh4f/relion/commit/8139725)
* `cli` refactor CLI tests to use `runCli` function instead of executing `dist/cli.js` [`f633ecd`](https://github.com/kh4f/relion/commit/f633ecd)

##### &emsp;&ensp;&nbsp; 🔗 [Full Commit History: `v0.4.0` → `v0.5.0`](https://github.com/kh4f/relion/compare/v0.4.0...v0.5.0) &ensp;/&ensp; _2025-09-09_


## &ensp; [` 📦 v0.4.0  `](https://github.com/kh4f/relion/compare/v0.3.0...v0.4.0)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✨ Features
* `changelog` add `latest-release` commit range support for changelog generation [`b57fc35`](https://github.com/kh4f/relion/commit/b57fc35)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🩹 Fixes
* `git-utils` quote commit range to handle caret character properly [`b5214a9`](https://github.com/kh4f/relion/commit/b5214a9)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🚜 Refactoring
* `git-utils` streamline the logic for determining the `from` commit [`a7fff71`](https://github.com/kh4f/relion/commit/a7fff71)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🚀 CI
* `workflows` update build step to run build in production mode [`6f70b99`](https://github.com/kh4f/relion/commit/6f70b99)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🛠️ Chores
* `package` reorder scripts by significance [`ed73343`](https://github.com/kh4f/relion/commit/ed73343)

##### &emsp;&ensp;&nbsp; 🔗 [Full Commit History: `v0.3.0` → `v0.4.0`](https://github.com/kh4f/relion/compare/v0.3.0...v0.4.0) &ensp;/&ensp; _2025-09-07_


## &ensp; [` 📦 v0.3.0  `](https://github.com/kh4f/relion/compare/v0.2.0...v0.3.0)

> [!CAUTION]
> The application has been rewritten from scratch. All previous APIs are modified or removed.

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⚠️ BREAKING CHANGES
* `core` complete rewrite with type-safe architecture [`7b2733c`](https://github.com/kh4f/relion/commit/7b2733c)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✨ Features
* `cli` implement CLI with profile support and lifecycle flags [`28ff96d`](https://github.com/kh4f/relion/commit/28ff96d)
* `config` add support for config profiles [`ef5fa54`](https://github.com/kh4f/relion/commit/ef5fa54)
* `config` add `zeroMajorBreakingIsMinor` option to treat breaking changes as minor for zero major version [`adad0ad`](https://github.com/kh4f/relion/commit/adad0ad)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🩹 Fixes
* `config-resolver` correctly override undefined options from profile config [`51b1a1e`](https://github.com/kh4f/relion/commit/51b1a1e)
* `changelog` safely read changelog file only if present [`3cd2c9f`](https://github.com/kh4f/relion/commit/3cd2c9f)
* `template` prevent HTML escaping by wrapping `subject` in triple-stash [`9387e93`](https://github.com/kh4f/relion/commit/9387e93)
* `defaults` use correct repo name variable in commit and tag templates [`94e6c43`](https://github.com/kh4f/relion/commit/94e6c43)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🚜 Refactoring
* `template` wrap release header in `header` partial as failover content [`60dd86f`](https://github.com/kh4f/relion/commit/60dd86f)
* `defaults` remove unused `header` partial from default changelog options [`bf266dd`](https://github.com/kh4f/relion/commit/bf266dd)
* `version-manager` enforce required `currentVersion` parameter in `determineNextVersion` function [`0f6c9d9`](https://github.com/kh4f/relion/commit/0f6c9d9)
* `core` complete rewrite with type-safe architecture [`7b2733c`](https://github.com/kh4f/relion/commit/7b2733c)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;📚 Documentation
* `changelog` update note to emphasize last release as a fork [`04712eb`](https://github.com/kh4f/relion/commit/04712eb)
* `instructions` fix line breaks in commit examples [`a933b20`](https://github.com/kh4f/relion/commit/a933b20)
* `copilot` fix types in commit naming examples [`f74bc38`](https://github.com/kh4f/relion/commit/f74bc38)
* `copilot` add guideline for using backticks in code entity names [`5bd5cec`](https://github.com/kh4f/relion/commit/5bd5cec)
* `copilot` update chore type description in commit naming guidelines [`8dafd31`](https://github.com/kh4f/relion/commit/8dafd31)
* `copilot` add initial instructions with project description [`8129f05`](https://github.com/kh4f/relion/commit/8129f05)
* `copilot` add suggest-commit prompt for generating commit messages [`00fcc7e`](https://github.com/kh4f/relion/commit/00fcc7e)
* `copilot` add commit naming guidelines with examples [`f7ecef7`](https://github.com/kh4f/relion/commit/f7ecef7)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🎨 Formatting
* `changelog` update console log formatting for generated changelog [`18298e8`](https://github.com/kh4f/relion/commit/18298e8)
* `tsdown` tighten up `loader` block [`5449afb`](https://github.com/kh4f/relion/commit/5449afb)
* `eslint` remove extra newlines [`ebbc9c1`](https://github.com/kh4f/relion/commit/ebbc9c1)
* `vitest` compact alias definition in config [`f2d5e1b`](https://github.com/kh4f/relion/commit/f2d5e1b)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🚀 CI
* `release` add build step before generating release notes [`8e92dd5`](https://github.com/kh4f/relion/commit/8e92dd5)
* `workflows` update `checkout` step to fetch full history for correct commits parsing [`bbd2e4a`](https://github.com/kh4f/relion/commit/bbd2e4a)
* `release` update release workflow to use `dist` directory for archive and correct release notes command [`f8058b8`](https://github.com/kh4f/relion/commit/f8058b8)
* `checks` run build before lint to resolve missing `dist` folder [`560b2ce`](https://github.com/kh4f/relion/commit/560b2ce)
* `workflows` remove unnecessary full commit history fetch [`d8cd08e`](https://github.com/kh4f/relion/commit/d8cd08e)
* `checks` update branch filter to allow all branches for push and PR events [`da67e24`](https://github.com/kh4f/relion/commit/da67e24)
* `release` run release workflow only on tags from main branch [`5a86517`](https://github.com/kh4f/relion/commit/5a86517)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;♻️ Reverts
* `ci/release` run release workflow only on tags from main branch [`a9f0190`](https://github.com/kh4f/relion/commit/a9f0190)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🧩 Dependencies
* `dev-deps` add `@types/semver` type definitions for TypeScript support [`63de11f`](https://github.com/kh4f/relion/commit/63de11f)
* `deps` add `cleye` and `handlebars` dependencies [`7f3d6fa`](https://github.com/kh4f/relion/commit/7f3d6fa)
* `deps` update dependencies to latest versions [`a5f3cf5`](https://github.com/kh4f/relion/commit/a5f3cf5)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🛠️ Chores
* `release` add `bump`, `commit` and `tag` properties to config [`894ded8`](https://github.com/kh4f/relion/commit/894ded8)
* `package` update entry points to use `dist` directory [`44ee9d2`](https://github.com/kh4f/relion/commit/44ee9d2)
* `release` migrate to new `relion` config and CLI format [`c927c59`](https://github.com/kh4f/relion/commit/c927c59)
* `package` update `files` field to include `dist` instead of `src` [`1249951`](https://github.com/kh4f/relion/commit/1249951)
* `lockfile` update `pnpm-lock.yaml` to match `package.json` [`14dcf0d`](https://github.com/kh4f/relion/commit/14dcf0d)
* `package` remove unused dependencies [`9c1c1af`](https://github.com/kh4f/relion/commit/9c1c1af)
* `package` reorder fields in `package.json` [`b6a08f1`](https://github.com/kh4f/relion/commit/b6a08f1)
* `package` add `types` field [`d26cf1d`](https://github.com/kh4f/relion/commit/d26cf1d)
* `package` simplify paths in `main` and `bin` fields by removing `./` prefix [`3e947f3`](https://github.com/kh4f/relion/commit/3e947f3)
* `package` fix GitHub username casing in metadata fields [`4974dc8`](https://github.com/kh4f/relion/commit/4974dc8)
* `package` update `repository` field to use HTTPS URL [`d676f94`](https://github.com/kh4f/relion/commit/d676f94)
* `package` flatten `repository`, `bugs`, `keywords`, `simple-git-hooks`, `lint-staged` and `files` fields [`f4e0710`](https://github.com/kh4f/relion/commit/f4e0710)
* `package` update author field to include email address [`524c0e6`](https://github.com/kh4f/relion/commit/524c0e6)
* `tsconfig` simplify `include` path by dropping `./` prefix [`fccb5da`](https://github.com/kh4f/relion/commit/fccb5da)
* `tsdown` remove explicit `dts` option since default is `true` [`beb6a27`](https://github.com/kh4f/relion/commit/beb6a27)
* `tsdown` simplify entry configuration [`b45c425`](https://github.com/kh4f/relion/commit/b45c425)
* `tsdown` remove CLI configuration [`0d11b24`](https://github.com/kh4f/relion/commit/0d11b24)
* `tsdown` remove unused `preset` entry from configuration [`a874f68`](https://github.com/kh4f/relion/commit/a874f68)
* `tsdown` remove explicit `outDir` since default is `dist` [`101c1db`](https://github.com/kh4f/relion/commit/101c1db)
* `tsdown` rename `common` to `baseConfig` [`8a3fdd7`](https://github.com/kh4f/relion/commit/8a3fdd7)
* `tsdown` replace `defineConfig` result with plain object for `common` [`672bdfa`](https://github.com/kh4f/relion/commit/672bdfa)
* `eslint` restrict base and stylistic rules to `*.ts` files [`7647314`](https://github.com/kh4f/relion/commit/7647314)
* `eslint` remove comment about linting `temp` directory in extension mode [`8452fc6`](https://github.com/kh4f/relion/commit/8452fc6)
* `eslint` add `brace-style` and `operator-linebreak` stylistic rules [`4f34a81`](https://github.com/kh4f/relion/commit/4f34a81)
* `eslint` add Type-Aware specific rule overrides [`a85f61e`](https://github.com/kh4f/relion/commit/a85f61e)
* `eslint` update Type-Aware Rules to use `strictTypeChecked` configuration [`ec6bdc5`](https://github.com/kh4f/relion/commit/ec6bdc5)
* `eslint` update global ignores to exclude all `temp*` folders [`fbb89fd`](https://github.com/kh4f/relion/commit/fbb89fd)
* `eslint` remove obsolete ts-expect-error comments in `eslint.config.ts` [`ecc4560`](https://github.com/kh4f/relion/commit/ecc4560)
* `pnpm` add initial pnpm workspace configuration with built dependencies [`45a3163`](https://github.com/kh4f/relion/commit/45a3163)
* `tsconfig` add `moduleDetection` set to `force` and remove `skipLibCheck` [`945eaff`](https://github.com/kh4f/relion/commit/945eaff)
* `vitest` simplify `hbsRaw` plugin to resolve `.hbs` files with `?raw` for automatic string import [`fb82f42`](https://github.com/kh4f/relion/commit/fb82f42)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🧪 Tests
* `cli` update test to include `-d` flag for changelog generation in dry run mode [`37f09f3`](https://github.com/kh4f/relion/commit/37f09f3)
* `index` prevent timeout errors by adjusting timeouts and commit range [`5aef401`](https://github.com/kh4f/relion/commit/5aef401)
* `cli` add test for generating changelog with `github` profile [`40cf56a`](https://github.com/kh4f/relion/commit/40cf56a)
* `changelog` add test for generating changelog with disabled commit hyperlinks and custom headers [`2126354`](https://github.com/kh4f/relion/commit/2126354)
* `index` add test for printing changelog to console [`34adbd7`](https://github.com/kh4f/relion/commit/34adbd7)
* `index` add lifecycle test [`9bcc6b3`](https://github.com/kh4f/relion/commit/9bcc6b3)
* `index` update smoke test description [`245f982`](https://github.com/kh4f/relion/commit/245f982)

##### &emsp;&ensp;&nbsp; 🔗 [Full Commit History: `v0.2.0` → `v0.3.0`](https://github.com/kh4f/relion/compare/v0.2.0...v0.3.0) &ensp;/&ensp; _2025-09-06_


## [v0.2.0](https://github.com/Kh4f/relion/compare/v0.1.1...v0.2.0) (2025-09-04)

> [!WARNING]
> This is the last release of `relion` as a fork of `commit-and-tag-version`. Future versions will be rewritten from scratch.

### ⚠ BREAKING CHANGES
* `options` The `packageFiles` option has been removed. The current version is now always read from `package.json`.
* `cli` The `--message` and `--changelogHeader` CLI options have been removed.

### 🩹 Bug Fixes
* `bump` prevent default `preMajor` from overriding dynamic value ([b33844a](https://github.com/Kh4f/relion/commit/b33844a85aca6c214808dd2e85ce74de2127dbd6))

### 🧹 Adjustments
* `options` remove `packageFiles` option and related logic ([0f715c4](https://github.com/Kh4f/relion/commit/0f715c45b29f5fa7aa81ab1faf789103a693539b))
* `cli` remove deprecated options `--message` and `--changelogHeader` ([5e56498](https://github.com/Kh4f/relion/commit/5e56498a2d2e0cdda83510e6c5cb8c79bc917e3e))


## [v0.1.1](https://github.com/Kh4f/relion/commits/v0.1.1) (2025-06-20)

> [!NOTE]
> This release is version `0.1.1` instead of `0.1.0` due to an npm restriction: [previously unpublished versions can never be republished](https://docs.npmjs.com/cli/v11/commands/npm-unpublish).

### ⚠ BREAKING CHANGES
* The project and related references have been renamed to 'relion'.
* `config` Changed alias for 'prerelease' option to 'P' to reserve 'p' for the new '--profile' option.
* `config` The 'skip' object has been removed from the config. Now, 'bump', 'changelog', 'commit', and 'tag' are explicit boolean flags. By default, they are false and must be set to true in the user config to enable the corresponding steps.
* `config` The 'firstRelease' property has been removed.
* `config` The config structure has changed. All preset options must now be placed under a 'preset' key in the config file (or cli args). This will be smart-merged with the default preset.

### ✨ Features
* `changelog` repeat last release changelog when no new commits ([bdcb9bc](https://github.com/Kh4f/relion/commit/bdcb9bca3ba38ef8a9a1332d82685b1c7a71508b))
* `config` add support for `_<profileName>` profiles with CLI `--profile` flag ([a940100](https://github.com/Kh4f/relion/commit/a940100796af3fdcc224f1987775d6a4c04d62dd))
* `config` add `.mjs` and `.ts` config support ([0efe117](https://github.com/Kh4f/relion/commit/0efe11740433e9a000878a4f0e0822a94a0ac6a2))
* `cli` add context.fullChangelogLink flag ([949f09e](https://github.com/Kh4f/relion/commit/949f09ee9ddb3ce38a6568b4509a1c08c264f6da))
* `templates` add full changelog link to footer ([e1ed82b](https://github.com/Kh4f/relion/commit/e1ed82b74c988b1785cd93336918b5f005cd1c38))
* `templates` add link to current tag commits in header if it is the only tag ([f8a8d73](https://github.com/Kh4f/relion/commit/f8a8d73ef57b5b55ec184c172384ae0f36ac18a8))
* `cli` add 'context.linkReferences' option ([bc048b4](https://github.com/Kh4f/relion/commit/bc048b4dd1446ee78f3ef670589a9ca5fb41ad3b))
* `preset` re-export handlebars templates as strings ([1dc5952](https://github.com/Kh4f/relion/commit/1dc5952f42b08e0a86d71b162d427df51d4855c5))
* `config` add 'all' option to run all lifecycle events ([d2a6fd3](https://github.com/Kh4f/relion/commit/d2a6fd3befd0dd13ab128e220a4a65236b2afe1d))
* `config` allow defining custom context ([93d6f91](https://github.com/Kh4f/relion/commit/93d6f91caa490d418b20498da9ccc32ccda8ae46))
* `config` add `writerOpts.commitsSort` to defaults ([dec6006](https://github.com/Kh4f/relion/commit/dec60066dc8690d97dac51707c03c0c0fbc75e4b))
* `config` replace skip object with explicit bump, changelog, commit, and tag flags ([6f9f4e0](https://github.com/Kh4f/relion/commit/6f9f4e0af3fed9f1687ac1234af2a466c4db579d))
* `config` require config preset options to be nested under 'preset' key ([01fc1f1](https://github.com/Kh4f/relion/commit/01fc1f16b71b40557877ad67442279892a9a4a60))
* `changelog` support version prefixes in release headers ([00e5410](https://github.com/Kh4f/relion/commit/00e54105d686d90629c1a95a000c78896065b9e9))

### 🩹 Bug Fixes
* `changelog` prevent empty changelog generation when last commit has a version tag ([080c007](https://github.com/Kh4f/relion/commit/080c007b88882bfbc7d0e9deb215252714de6475))
* `writer` correct `previousTag` detection for `releaseCount` > 1 ([464cdfa](https://github.com/Kh4f/relion/commit/464cdfa90bef7af3154e6e3cb1a6d80268c2d375))
* `cli` use `defaults.preset` for default preset options ([c824820](https://github.com/Kh4f/relion/commit/c824820fa355fc5ad4ff3666a8fa354d35ca35f4))
* `config` avoid setting `preMajor` to false by default ([a22bd20](https://github.com/Kh4f/relion/commit/a22bd202731c8f4a8c9eb2cea622ed5ac1b9b720))
* `config` resolve script import path with pathToFileURL ([3f6f930](https://github.com/Kh4f/relion/commit/3f6f93041403573d736eebd3ae55a4b1a922843a))
* `package` update release script to use node for execution ([bd194d4](https://github.com/Kh4f/relion/commit/bd194d4e66884ca414659e6430cdda30427d6c1d))
* `core` move `args.all` handling after `args` initialization ([e97b046](https://github.com/Kh4f/relion/commit/e97b04612019a49f9a3aca4653ae88999b3df2e6))
* `cli` change aliases for commit-all and tag-prefix to avoid conflicts ([8adfdf7](https://github.com/Kh4f/relion/commit/8adfdf7cfe8e6545da1e6fe23298b0669102f142))
* `commit` add tag prefix to version in release commit message ([0b955a4](https://github.com/Kh4f/relion/commit/0b955a4f3f6377b3092d086bd44a77c3e27816f5))
* `bump` always resolve new version even if skip.bump is set ([6b560c9](https://github.com/Kh4f/relion/commit/6b560c967e8f8522ecfda1529dde26d0f80ebfe7))
* `bump` add `await` before calling `resolveUpdaterObjectFromArgument` ([a7026fa](https://github.com/Kh4f/relion/commit/a7026fa6513bf2505415e2c69215173cec194bd1))

### 🧹 Adjustments
* rename project to 'relion' ([faaa473](https://github.com/Kh4f/relion/commit/faaa473670c52e05821bdcc372f1a434eba1fb38))
* `config` remove unnecessary? `firstRelease` property ([67266a8](https://github.com/Kh4f/relion/commit/67266a84668e34a1b22ddd361c702010b6619aac))
