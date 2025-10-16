# Changelog


## &ensp; [` 📦 v0.23.0  `](https://github.com/kh4f/relion/compare/v0.22.0...v0.23.0)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⚠️ BREAKING CHANGES
- The changelog output configuration now uses separate `file` and `output` options. To change the output file, update the `changelog.file` property. <sup>[1]</sup>
- The `prevReleaseHeaderPattern` property has been removed from changelog config. Use `latestReleasePattern` instead. <sup>[2]</sup>
- The context option `hyperlinks` has been renamed to `commitRefLinks`. <sup>[3]</sup>
- The changelog partial previously named `main` has been renamed to `body`. <sup>[4]</sup>
- The default `commitHyperlink` and `refHyperlink` context settings have been removed. Use `hyperlinks: boolean` instead. <sup>[5]</sup>
- CLI arguments now always override corresponding options from the config, even when a profile is used. <sup>[6]</sup>

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✨ Features
- **changelog**: 
  - add `commitRefLinkPattern` option to changelog configuration [`6ea2d5a`](https://github.com/kh4f/relion/commit/6ea2d5a)
  - support extracting full changelog for latest release from file [`f84960d`](https://github.com/kh4f/relion/commit/f84960d)
  - support extracting latest release partials from changelog [`a7af989`](https://github.com/kh4f/relion/commit/a7af989)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🩹 Fixes
- **hbs-helper**: refine commit/ref link pattern in `modifyPartialWithContext` [`145cc70`](https://github.com/kh4f/relion/commit/145cc70)
- **defaults**: update `latestReleasePattern` to include empty lines after header [`334e0a8`](https://github.com/kh4f/relion/commit/334e0a8)
- **changelog**: correct `latestReleasePattern` to stop at next `##` header [`6db2687`](https://github.com/kh4f/relion/commit/6db2687)
- **cli**: 
  - prevent profile `lifecycle` option from overwriting CLI `-f` flag [`b075b8a`](https://github.com/kh4f/relion/commit/b075b8a)
  - ensure `profile` property is set when CLI `-p` flag is provided [`d855871`](https://github.com/kh4f/relion/commit/d855871)
  - ensure `latest` flag is applied even if `changelog` is not defined [`bd5d4f0`](https://github.com/kh4f/relion/commit/bd5d4f0)
  - ensure `profile` and `dry` flags override config values [`f60348d`](https://github.com/kh4f/relion/commit/f60348d)
  - clone `config` input to avoid mutating caller's object [`6c11aef`](https://github.com/kh4f/relion/commit/6c11aef)
  - validate lifecycle step aliases [`cd693f8`](https://github.com/kh4f/relion/commit/cd693f8)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🚜 Refactoring
- **changelog**: 
  - split `output` option into `file` and `output` [`409438b`](https://github.com/kh4f/relion/commit/409438b) ⚠️<sup>[1]</sup>
  - rename `main` partial to `body` in release template [`61d2ccd`](https://github.com/kh4f/relion/commit/61d2ccd) ⚠️<sup>[4]</sup>
  - consolidate hyperlink flags into `hyperlinks` [`fa3743e`](https://github.com/kh4f/relion/commit/fa3743e) ⚠️<sup>[5]</sup>
- **config**: 
  - remove `changelog.prevReleaseHeaderPattern` in favor of `latestReleasePattern` [`436aa34`](https://github.com/kh4f/relion/commit/436aa34) ⚠️<sup>[2]</sup>
  - rename `hyperlinks` to `commitRefLinks` [`6501e97`](https://github.com/kh4f/relion/commit/6501e97) ⚠️<sup>[3]</sup>
- **cli**: prioritize CLI arguments over config profile options [`09bcd35`](https://github.com/kh4f/relion/commit/09bcd35) ⚠️<sup>[6]</sup>

##### &emsp;&ensp;&nbsp;&nbsp; [_All Release Commits_](https://github.com/kh4f/relion/compare/v0.22.0...v0.23.0) &ensp;•&ensp; _Oct 16, 2025_


## &ensp; [` 📦 v0.22.0  `](https://github.com/kh4f/relion/compare/v0.21.0...v0.22.0)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⚠️ BREAKING CHANGES
- CLI flags `--bump`, `--changelog`, `--commit`, and `--tag` have been removed. Use `--lifecycle` with step abbreviations instead (e.g., `--lifecycle blmt` or `-f all`). <sup>[1]</sup>
- Config options `bump`, `changelog`, `commit`, and `tag` no longer accept boolean values. Use the `lifecycle` array to control step execution and these options for step-specific configuration only. <sup>[1]</sup>
- The exported `BumpFiles` type was removed. <sup>[2]</sup>

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✨ Features
- **changelog**: apply sentence case formatting for breaking change descriptions [`0e67566`](https://github.com/kh4f/relion/commit/0e67566)
- **config**: add implicit "default" profile support [`0121ff1`](https://github.com/kh4f/relion/commit/0121ff1)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🩹 Fixes
- **commits-parser**: restrict `BREAKING CHANGES` detection to line start [`893e5af`](https://github.com/kh4f/relion/commit/893e5af)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🚜 Refactoring
- **config**: replace boolean lifecycle flags with unified `lifecycle` array [`b0d2d33`](https://github.com/kh4f/relion/commit/b0d2d33) ⚠️<sup>[1]</sup>

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🏷️ Types
- **config**: remove `BumpFiles` type and use `(string | Bumper)[]` directly for `bump` instead [`418b6ca`](https://github.com/kh4f/relion/commit/418b6ca) ⚠️<sup>[2]</sup>

##### &emsp;&ensp;&nbsp;&nbsp; [_All Release Commits_](https://github.com/kh4f/relion/compare/v0.21.0...v0.22.0) &ensp;•&ensp; _Oct 14, 2025_


## &ensp; [` 📦 v0.21.0  `](https://github.com/kh4f/relion/compare/v0.20.0...v0.21.0)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⚠️ BREAKING CHANGES
- The `commitsScope` option has been moved from `changelog.commitsScope` to the top-level `commitsScope` in the configuration. <sup>[1]</sup>

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🩹 Fixes
- **bump**: ensure `commitsScope` filter applies when determining next version [`ec66d36`](https://github.com/kh4f/relion/commit/ec66d36) ⚠️<sup>[1]</sup>

##### &emsp;&ensp;&nbsp;&nbsp; [_All Release Commits_](https://github.com/kh4f/relion/compare/v0.20.0...v0.21.0) &ensp;•&ensp; _Oct 13, 2025_


## &ensp; [` 📦 v0.20.0  `](https://github.com/kh4f/relion/compare/v0.19.0...v0.20.0)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⚠️ BREAKING CHANGES
- The `ignoreLimit` property is replaced with more flexible `show` property in changelog section definitions. <sup>[1]</sup>

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✨ Features
- **changelog**: 
  - add `review` option for interactive changelog review before commit/tag [`0ccb51e`](https://github.com/kh4f/relion/commit/0ccb51e)
  - add `show` property for advanced section rendering control [`144f36a`](https://github.com/kh4f/relion/commit/144f36a) ⚠️<sup>[1]</sup>
  - add `commitsScope` option to filter commits by paths [`6caff98`](https://github.com/kh4f/relion/commit/6caff98)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🚜 Refactoring
- **relion-config**: separate full release workflow into dedicated `local` profile [`4d417f2`](https://github.com/kh4f/relion/commit/4d417f2)
- **tests**: mirror `src` folder structure [`060f273`](https://github.com/kh4f/relion/commit/060f273)
- **lifecycle**: rename `lifecycles` folder to `lifecycle` [`0b608c3`](https://github.com/kh4f/relion/commit/0b608c3)
- **defaults**: 
  - update `message` in `defaultTagOptions` to use `defaultCommitOptions.message` [`3ff93db`](https://github.com/kh4f/relion/commit/3ff93db)
  - use `chore(release):` format for default commit and tag messages [`7c0a2ea`](https://github.com/kh4f/relion/commit/7c0a2ea)
  - update commit partial to use `breakingChangesIndicator` partial [`be0931a`](https://github.com/kh4f/relion/commit/be0931a)
- **config-resolver**: simplify parameters in `groupCommitsByReleases` function [`4b85951`](https://github.com/kh4f/relion/commit/4b85951)
- **commits-parser**: rename `arg1` to `commits` in `parseCommits` function [`769ef93`](https://github.com/kh4f/relion/commit/769ef93)
- **git-helper**: make `prevReleaseTagPattern` optional in `getRawCommits` and `getReleaseTags` [`d4b5c8e`](https://github.com/kh4f/relion/commit/d4b5c8e)

##### &emsp;&ensp;&nbsp;&nbsp; [_All Release Commits_](https://github.com/kh4f/relion/compare/v0.19.0...v0.20.0) &ensp;•&ensp; _Oct 9, 2025_


## &ensp; [` 📦 v0.19.0  `](https://github.com/kh4f/relion/compare/v0.18.0...v0.19.0)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⚠️ BREAKING CHANGES
- The `isBreakingCommitInOtherTypeGroup` helper has been removed as it is no longer necessary: commits with breaking changes are now always displayed in their respective sections regardless of line limits. <sup>[1]</sup>
- The `changelogSectionsSelector` export has been renamed to `sectionsSelector`. <sup>[2]</sup>

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✨ Features
- **changelog**: 
  - display commits with breaking changes in all sections regardless of line limit [`0cf7ae2`](https://github.com/kh4f/relion/commit/0cf7ae2) ⚠️<sup>[1]</sup>
  - add `ignoreLimit` flag to control section inclusion despite line limits [`c46e531`](https://github.com/kh4f/relion/commit/c46e531)
  - add `maxLinesPerRelease` option to limit changelog length per release [`037ebd8`](https://github.com/kh4f/relion/commit/037ebd8)
  - display issue/pr references next to commits [`a59963f`](https://github.com/kh4f/relion/commit/a59963f)
  - filter out reverted commits and their reverts within same release [`79274ca`](https://github.com/kh4f/relion/commit/79274ca)
  - add release changelog link to footer template [`011abc0`](https://github.com/kh4f/relion/commit/011abc0)
- **sections-selector**: add `modify` method for modifying specific sections [`8b2b221`](https://github.com/kh4f/relion/commit/8b2b221)
- **config**: add `footerChangelogUrl` option to `context` for changelog link control [`bf8371f`](https://github.com/kh4f/relion/commit/bf8371f)
- **commit**: support `raw` field in `Reference` for footer refs parsing [`0c6cf75`](https://github.com/kh4f/relion/commit/0c6cf75)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🩹 Fixes
- **config**: 
  - merge user context with default one [`2f17c70`](https://github.com/kh4f/relion/commit/2f17c70)
  - allow mixed `ParsedCommit` and `RawCommit` types in `Context.commits` [`be9204c`](https://github.com/kh4f/relion/commit/be9204c)
- **commits-parser**: prevent body from being parsed as footer when containing ref keywords [`3132b13`](https://github.com/kh4f/relion/commit/3132b13)
- **changelog**: 
  - move inline partials to defaults to allow user overrides [`80eeecf`](https://github.com/kh4f/relion/commit/80eeecf)
  - resolve Handlebars state leakage by using local instance [`a934ed4`](https://github.com/kh4f/relion/commit/a934ed4)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🚜 Refactoring
- **utils**: rename `changelogSectionsSelector` to `sectionsSelector` and update related entities [`10bfbf9`](https://github.com/kh4f/relion/commit/10bfbf9) ⚠️<sup>[2]</sup>

##### &emsp;&ensp;&nbsp;&nbsp; [_All Release Commits_](https://github.com/kh4f/relion/compare/v0.18.0...v0.19.0) &ensp;•&ensp; _Oct 5, 2025_


## &ensp; [` 📦 v0.18.0  `](https://github.com/kh4f/relion/compare/v0.17.1...v0.18.0)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⚠️ BREAKING CHANGES
- The `versionSourceFile` is no longer automatically included in the `bump` array (but still is if `bump` is `true`). <sup>[1]</sup>

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🚜 Refactoring
- **config**: require explicit `versionSourceFile` inclusion in `bump` array [`fd5ad3c`](https://github.com/kh4f/relion/commit/fd5ad3c) ⚠️<sup>[1]</sup>

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🚀 CI
- **checks**: improve comment clarity for commit history fetching [`d787525`](https://github.com/kh4f/relion/commit/d787525)
- **workflows**: update lint step to use `lint:fix` script [`1aff340`](https://github.com/kh4f/relion/commit/1aff340)
- **release**: add linting and testing steps to release workflow [`b61b08d`](https://github.com/kh4f/relion/commit/b61b08d)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;♻️ Reverts
- **config**: allow skipping bump for `versionSourceFile` via `!versionSourceFile` in `bump` array [`0ac5ff0`](https://github.com/kh4f/relion/commit/0ac5ff0)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🧩 Dependencies
- **dev-deps**: bump `lint-staged` from 16.2.1 to 16.2.3 (#9) [`0ae604d`](https://github.com/kh4f/relion/commit/0ae604d)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🛠️ Chores
- **renovate**: replace `matchCurrentAge` with `minimumReleaseAge` for patch and minor updates [`9471d0d`](https://github.com/kh4f/relion/commit/9471d0d)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🧪 Tests
- **changelog**: 
  - skip test for generating changelog with transformed partials [`9c064b7`](https://github.com/kh4f/relion/commit/9c064b7)
  - update snapshot for transformed partials test [`67ed389`](https://github.com/kh4f/relion/commit/67ed389)
  - update snapshot for changelog generation tests [`a9dc9a2`](https://github.com/kh4f/relion/commit/a9dc9a2)
- **bump**: add test for bumping version in `manifest.json` [`f2646f3`](https://github.com/kh4f/relion/commit/f2646f3)

##### &emsp;&ensp;&nbsp;&nbsp; [_All Release Commits_](https://github.com/kh4f/relion/compare/v0.17.1...v0.18.0) &ensp;•&ensp; _Oct 2, 2025_


## &ensp; [` 📦 v0.17.1  `](https://github.com/kh4f/relion/compare/v0.17.0...v0.17.1)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🩹 Fixes
- **tag**: do not apply default prefix when `newTagPrefix` is empty string [`56dd8a2`](https://github.com/kh4f/relion/commit/56dd8a2)
- **cli**: prevent `ReferenceError` by reordering `loadConfigFile` declaration [`43b08d0`](https://github.com/kh4f/relion/commit/43b08d0)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🚜 Refactoring
- **tests**: clean up repeated tests in `relion.test.ts` [`33845b8`](https://github.com/kh4f/relion/commit/33845b8)
- **changelog**: always print changelog to console in dry run mode [`b3fd2f3`](https://github.com/kh4f/relion/commit/b3fd2f3)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🧪 Tests
- **changelog**: add test for transformed footer with custom changelog URL partial [`e175362`](https://github.com/kh4f/relion/commit/e175362)

##### &emsp;&ensp;&nbsp;&nbsp; [_All Release Commits_](https://github.com/kh4f/relion/compare/v0.17.0...v0.17.1) &ensp;•&ensp; _Sep 28, 2025_


## &ensp; [` 📦 v0.17.0  `](https://github.com/kh4f/relion/compare/v0.16.0...v0.17.0)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⚠️ BREAKING CHANGES
- The `VersionedFile` type now uses `file` and `pattern` properties instead of `filePath` and `versionPattern`. <sup>[1]</sup>
- The `silent` option has been removed. Use `logLevel` instead to control logging verbosity. <sup>[2]</sup>
- The `bumpResults` property is no longer returned by the main `relion()` function. <sup>[3]</sup>

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✨ Features
- **changelog**: add function support for `partials` to transform fallback content [`7f070fd`](https://github.com/kh4f/relion/commit/7f070fd)
- **bump**: add support for custom replacement for versioned files [`77aa591`](https://github.com/kh4f/relion/commit/77aa591)
- **config**: 
  - allow skipping bump for `versionSourceFile` via `!versionSourceFile` in `bump` array [`ba77ad8`](https://github.com/kh4f/relion/commit/ba77ad8)
  - support extracting current version from latest release tag instead of file [`9d96a36`](https://github.com/kh4f/relion/commit/9d96a36)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🩹 Fixes
- **config-resolver**: preserve all default versioned file attributes when matching custom file [`33aa299`](https://github.com/kh4f/relion/commit/33aa299)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🚜 Refactoring
- **utils**: extract `hbs-load-hook` to separate module to avoid registration conflict [`88c6fea`](https://github.com/kh4f/relion/commit/88c6fea)
- **release**: update relion config to use 'logLevel' [`591e2c8`](https://github.com/kh4f/relion/commit/591e2c8)
- **config**: 
  - rename `filePath` and `versionPattern` to `file` and `pattern` [`88f1446`](https://github.com/kh4f/relion/commit/88f1446) ⚠️<sup>[1]</sup>
  - replace `silent` option with `logLevel` for improved logging control [`9cfb8af`](https://github.com/kh4f/relion/commit/9cfb8af) ⚠️<sup>[2]</sup>
- **logger**: remove unused `deepLog` function [`9c0b9a2`](https://github.com/kh4f/relion/commit/9c0b9a2)
- **commits-parser**: replace `console.warn` with `warn` utility function [`9982505`](https://github.com/kh4f/relion/commit/9982505)
- **core**: remove `bumpResults` from `relion()` return values [`0626642`](https://github.com/kh4f/relion/commit/0626642) ⚠️<sup>[3]</sup>
- **vitest**: use `silent: true` in config instead of mocking `console.log` [`9cb40a7`](https://github.com/kh4f/relion/commit/9cb40a7)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🎨 Style
- **config-resolver**: add quotes around `versionSourceFile.file` in log output [`7f08be2`](https://github.com/kh4f/relion/commit/7f08be2)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🧩 Dependencies
- **dev-deps**: 
  - bump `tsdown` from 0.15.4 to 0.15.5 [`99bf48b`](https://github.com/kh4f/relion/commit/99bf48b)
  - bump `typescript-eslint` from 8.42.0 to 8.44.1 (#7) [`c3f350d`](https://github.com/kh4f/relion/commit/c3f350d)
  - bump `lint-staged` from 16.1.6 to 16.2.1 [`ac40d36`](https://github.com/kh4f/relion/commit/ac40d36)
  - bump `tsx` from 4.20.5 to 4.20.6 (#6) [`45121c3`](https://github.com/kh4f/relion/commit/45121c3)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🧪 Tests
- **changelog**: wrap tests for partials customization in dedicated describe block [`7272cf7`](https://github.com/kh4f/relion/commit/7272cf7)
- **fixtures**: add fixture files for `manifest.json`, `package.json`, and `versions.json` [`dc46f7c`](https://github.com/kh4f/relion/commit/dc46f7c)
- **setup**: mock `defaults` module for configurable `dryRun` and `changelog.output` in tests [`c7ba9dc`](https://github.com/kh4f/relion/commit/c7ba9dc)

##### &emsp;&ensp;&nbsp;&nbsp; [_All Release Commits_](https://github.com/kh4f/relion/compare/v0.16.0...v0.17.0) &ensp;•&ensp; _Sep 28, 2025_


## &ensp; [` 📦 v0.16.0  `](https://github.com/kh4f/relion/compare/v0.15.0...v0.16.0)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⚠️ BREAKING CHANGES
- The `groupCommitsByScope` option is now enabled by default. <sup>[1]</sup>

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✨ Features
- **changelog**: add support for scope-based commit grouping [`898c5e3`](https://github.com/kh4f/relion/commit/898c5e3) ⚠️<sup>[1]</sup>

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🩹 Fixes
- **templates**: add extra space for correct 2nd-level list rendering [`34fcc6e`](https://github.com/kh4f/relion/commit/34fcc6e)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🚜 Refactoring
- **tests**: update describe block naming for manual tests [`9a58332`](https://github.com/kh4f/relion/commit/9a58332)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;📚 Documentation
- **commit-naming**: correct markdown code block wrapping instruction [`0da62ab`](https://github.com/kh4f/relion/commit/0da62ab)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🧩 Dependencies
- **deps**: bump node.js from v24.8.0 to v24.9.0 [`6b0b03a`](https://github.com/kh4f/relion/commit/6b0b03a)
- **dev-deps**: 
  - bump `globals` from 16.3.0 to 16.4.0 [`f68f9f5`](https://github.com/kh4f/relion/commit/f68f9f5)
  - bump `eslint` from 9.34.0 to 9.36.0 [`d6cc118`](https://github.com/kh4f/relion/commit/d6cc118)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🧪 Tests
- **setup**: conditionally mock `console.log` for non-vscode test runs [`be646da`](https://github.com/kh4f/relion/commit/be646da)
- **changelog**: add snapshot for changelog generation with scope groups for custom commits [`c062e45`](https://github.com/kh4f/relion/commit/c062e45)

##### &emsp;&ensp;&nbsp;&nbsp; [_All Release Commits_](https://github.com/kh4f/relion/compare/v0.15.0...v0.16.0) &ensp;•&ensp; _Sep 26, 2025_


## &ensp; [` 📦 v0.15.0  `](https://github.com/kh4f/relion/compare/v0.14.1...v0.15.0)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⚠️ BREAKING CHANGES
- Configuration property `changelog.versionTag` is now `changelog.releaseTag`. <sup>[1]</sup>

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✨ Features
- **config**: add `newTagPrefix` option with priority over `newTagFormat` [`a0b25f2`](https://github.com/kh4f/relion/commit/a0b25f2)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⚡ Performance
- **git-helper**: implement caching for version tags retrieval [`9c03d87`](https://github.com/kh4f/relion/commit/9c03d87)
- **commits-parser**: use `Map` for `parsedCommitsCache` [`81e9687`](https://github.com/kh4f/relion/commit/81e9687)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🚜 Refactoring
- **cli.test**: separate manual CLI inspection tests [`1b540ec`](https://github.com/kh4f/relion/commit/1b540ec)
- **cli**: return input config along with `relion` output [`b2d802a`](https://github.com/kh4f/relion/commit/b2d802a)
- **tests**: rename `release.test.ts` to `relion.test.ts` [`4b6289a`](https://github.com/kh4f/relion/commit/4b6289a)
- **tests**: remove `testConfig` and simplify changelog tests [`c518d34`](https://github.com/kh4f/relion/commit/c518d34)
- **tests**: replace `testConfig` with `silent: true, dryRun: true` in changelog tests [`ce9af03`](https://github.com/kh4f/relion/commit/ce9af03)
- **tests**: replace `testConfig` with `silent: true` in tag generation tests [`77fff5d`](https://github.com/kh4f/relion/commit/77fff5d)
- **config**: rename `versionTag` to `releaseTag` across codebase [`0a188eb`](https://github.com/kh4f/relion/commit/0a188eb) ⚠️<sup>[1]</sup>
- **commits-parser**: rename `parsedCommits` to `parsedCommitsCache` [`200e19b`](https://github.com/kh4f/relion/commit/200e19b)
- **tests**: change config path from `relion.config.ts` to `relion.config.cli.ts` [`20f54cd`](https://github.com/kh4f/relion/commit/20f54cd)
- **tests**: rename `relion.config.test` to `relion.test-config` to prevent vitest from treating it as a test file [`2f7fe92`](https://github.com/kh4f/relion/commit/2f7fe92)
- **tests**: move changelog test config to `fixtures/relion.config.test.ts` [`9e3e90a`](https://github.com/kh4f/relion/commit/9e3e90a)
- **ci**: simplify event trigger syntax [`960bfef`](https://github.com/kh4f/relion/commit/960bfef)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;📚 Documentation
- **commit-naming**: update code blocks to use md format [`67136aa`](https://github.com/kh4f/relion/commit/67136aa)
- **commit-naming**: add rule to wrap commit message in markdown code block [`6a472a6`](https://github.com/kh4f/relion/commit/6a472a6)
- **commit-naming**: update guidelines to include 'flags' in backtick usage [`e8ce2f5`](https://github.com/kh4f/relion/commit/e8ce2f5)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🎨 Style
- **commit-naming**: remove redundant blank lines [`28db47f`](https://github.com/kh4f/relion/commit/28db47f)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🚀 CI
- **release**: add comment to clarify `ref` usage in checkout step [`43695e7`](https://github.com/kh4f/relion/commit/43695e7)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🏷️ Types
- **core, cli**: specify explicit return types for `runCli` and `relion` [`8c4274e`](https://github.com/kh4f/relion/commit/8c4274e)
- **result**: update `RelionResult` to use `null` instead of `undefined` for optional properties [`9565cbd`](https://github.com/kh4f/relion/commit/9565cbd)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🧩 Dependencies
- **dev-deps**: bump `@types/node` from 24.3.1 to 24.5.2 [`905f259`](https://github.com/kh4f/relion/commit/905f259)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🧪 Tests
- **setup**: mock console output and set default `dryRun`/`changelog.output` for `relion()` tests [`726bd29`](https://github.com/kh4f/relion/commit/726bd29)
- **changelog**: update snapshots after renaming `changelog generation` test [`9df75f0`](https://github.com/kh4f/relion/commit/9df75f0)
- **changelog**: rename test to use 'generate' instead of 'print' [`f4af163`](https://github.com/kh4f/relion/commit/f4af163)
- **changelog**: separate manual changelog inspection from automated tests [`daba3b5`](https://github.com/kh4f/relion/commit/daba3b5)

##### &emsp;&ensp;&nbsp;&nbsp; [_All Release Commits_](https://github.com/kh4f/relion/compare/v0.14.1...v0.15.0) &ensp;•&ensp; _Sep 25, 2025_


## &ensp; [` 📦 v0.14.1  `](https://github.com/kh4f/relion/compare/v0.14.0...v0.14.1)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🚜 Refactoring
- **ci**: simplify `ci.yml` structure [`100bae3`](https://github.com/kh4f/relion/commit/100bae3)
- **ci**: simplify `release.yml` structure and improve readability [`c8698c8`](https://github.com/kh4f/relion/commit/c8698c8)
- **commits-parser**: remove unnecessary `Promise` from `parseRefs` and update related functions [`52bd01b`](https://github.com/kh4f/relion/commit/52bd01b)
- **core**: move `defineConfig` export from `relion.ts` to `index.ts` [`616f12b`](https://github.com/kh4f/relion/commit/616f12b)
- **tests**: rename release workflow test file to `release.test.ts` [`39df949`](https://github.com/kh4f/relion/commit/39df949)
- **tests**: clean up `index.test.ts` and move changelog tests to dedicated module [`b9a8ffb`](https://github.com/kh4f/relion/commit/b9a8ffb)
- **tests**: simplify import path for `relion` module [`5cd32fd`](https://github.com/kh4f/relion/commit/5cd32fd)
- **templates**: extract `compareLink` to inline partial [`5274dde`](https://github.com/kh4f/relion/commit/5274dde)
- **templates**: use `@root` instead of `../../` [`a7200a7`](https://github.com/kh4f/relion/commit/a7200a7)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🚀 CI
- **release**: wrap `pnpm --silent release:github` in quotes for proper execution [`9ac5eaa`](https://github.com/kh4f/relion/commit/9ac5eaa)
- **release**: fix publish workflow by specifying `ref: main` instead of disabling git checks [`1eebd3c`](https://github.com/kh4f/relion/commit/1eebd3c)
- **checks**: simplify workflow triggers to avoid double runs for PRs [`4502e9f`](https://github.com/kh4f/relion/commit/4502e9f)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🧩 Dependencies
- **dev-deps**: bump `@stylistic/eslint-plugin` from 5.3.1 to 5.4.0 [`2da60b5`](https://github.com/kh4f/relion/commit/2da60b5)
- **dev-deps**: bump `@eslint/js` from 9.34.0 to 9.36.0 [`f54418f`](https://github.com/kh4f/relion/commit/f54418f)
- **deps**: bump node.js from v24.5.0 to v24.8.0 [`745b215`](https://github.com/kh4f/relion/commit/745b215)
- **dev-deps**: bump `tsdown` from 0.14.2 to 0.15.4 (#1) [`ac9b5ce`](https://github.com/kh4f/relion/commit/ac9b5ce)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🛠️ Chores
- **gitignore**: add release archives to ignored files to fix unclean working tree error [`99b15b6`](https://github.com/kh4f/relion/commit/99b15b6)
- **package-manager**: bump pnpm from 10.17.0 to 10.17.1 [`c655a24`](https://github.com/kh4f/relion/commit/c655a24)
- **actions**: bump actions/checkout action from v4 to v5 (#2) [`d7037e9`](https://github.com/kh4f/relion/commit/d7037e9)
- **actions**: bump actions/setup-node action from v4 to v5 (#3) [`10a1a1d`](https://github.com/kh4f/relion/commit/10a1a1d)
- **package**: update `test` script to run all tests [`942b38f`](https://github.com/kh4f/relion/commit/942b38f)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🧪 Tests
- **changelog**: clean up tests, keep only informative ones [`7e40210`](https://github.com/kh4f/relion/commit/7e40210)
- **cli**: rename test suite to `runCli` [`ff78678`](https://github.com/kh4f/relion/commit/ff78678)
- **cli**: add tests for config loading from default and custom paths [`8b25e13`](https://github.com/kh4f/relion/commit/8b25e13)

##### &emsp;&ensp;&nbsp;&nbsp; [_All Release Commits_](https://github.com/kh4f/relion/compare/v0.14.0...v0.14.1) &ensp;•&ensp; _Sep 24, 2025_


## &ensp; [` 📦 v0.14.0  `](https://github.com/kh4f/relion/compare/v0.13.0...v0.14.0)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⚠️ BREAKING CHANGES
- The CLI flag `--dry-run` has been renamed to `--dry` . <sup>[1]</sup>
- CLI lifecycle flags now override falsy config values instead of being ignored when config explicitly sets them to false. <sup>[2]</sup>
- The alias for the `commit` flag has been changed to 'm'. <sup>[3]</sup>

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✨ Features
- **cli**: add support for custom config file path via `--config` flag [`db88953`](https://github.com/kh4f/relion/commit/db88953) ⚠️<sup>[3]</sup>

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🩹 Fixes
- **cli**: use parsed `--config` flag value when loading config file [`87f82d7`](https://github.com/kh4f/relion/commit/87f82d7)
- **config-resolver**: always return override object if defined, even if false [`52542ad`](https://github.com/kh4f/relion/commit/52542ad)
- **cli**: prevent `inputArgs` from being cleared after `cli()` call [`054fc8d`](https://github.com/kh4f/relion/commit/054fc8d)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🚜 Refactoring
- **release**: explicitly set `bump` and `changelog` options in config instead of passing flags in release scripts [`eaf1747`](https://github.com/kh4f/relion/commit/eaf1747)
- **release**: use `tsx` + `hbs-load-hook` to execute `cli.ts` instead of `cli.js` [`dc4cd36`](https://github.com/kh4f/relion/commit/dc4cd36)
- **utils**: rename `templater` module to `hbs-helper` [`dec081e`](https://github.com/kh4f/relion/commit/dec081e)
- **cli**: extract config file loading to `loadConfigFile` function [`ee404aa`](https://github.com/kh4f/relion/commit/ee404aa)
- **cli**: reorder parameters in `runCli` function [`a2f0024`](https://github.com/kh4f/relion/commit/a2f0024)
- **cli**: update dry run flag name to `dry` [`7587e2c`](https://github.com/kh4f/relion/commit/7587e2c) ⚠️<sup>[1]</sup>
- **cli**: enable lifecycle flags to override falsy config values [`149b9a2`](https://github.com/kh4f/relion/commit/149b9a2) ⚠️<sup>[2]</sup>
- **cli**: allow `inputArgs` to be a string [`1805684`](https://github.com/kh4f/relion/commit/1805684)
- **cli**: rename `argvs` to `inputArgs` and `argv` to `parsedArgs` [`a71b9f8`](https://github.com/kh4f/relion/commit/a71b9f8)
- **cli**: mode config file handling after parsing args [`90fe6e2`](https://github.com/kh4f/relion/commit/90fe6e2)
- **cli**: return result from `relion` function in `runCli` [`31693f9`](https://github.com/kh4f/relion/commit/31693f9)
- **tests**: separate CLI tests into dedicated `cli.test.ts` file [`2c46d68`](https://github.com/kh4f/relion/commit/2c46d68)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🎨 Style
- **license**: remove trailing newline [`6abf71a`](https://github.com/kh4f/relion/commit/6abf71a)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🛠️ Chores
- **package**: add `engines` field to specify Node.js version requirement [`86a9a13`](https://github.com/kh4f/relion/commit/86a9a13)
- **package**: add `relion` script and update `release*` commands [`574bac3`](https://github.com/kh4f/relion/commit/574bac3)
- **lint-staged**: restrict linting to ts files only [`14ea3f1`](https://github.com/kh4f/relion/commit/14ea3f1)
- **eslint**: update `prefer-nullish-coalescing` to ignore boolean [`357f775`](https://github.com/kh4f/relion/commit/357f775)
- **renovate**: narrow ignore pattern to `temp` only [`6f9725d`](https://github.com/kh4f/relion/commit/6f9725d)
- **renovate**: remove `prConcurrentLimit` to use default value [`8b5ff3f`](https://github.com/kh4f/relion/commit/8b5ff3f)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🧪 Tests
- **cli**: update test description for help message output [`8edaad5`](https://github.com/kh4f/relion/commit/8edaad5)
- **cli**: replace aliases with long-form flags for clarity [`0275d1f`](https://github.com/kh4f/relion/commit/0275d1f)
- **cli**: update full release workflow test options [`1ef5e4e`](https://github.com/kh4f/relion/commit/1ef5e4e)
- **cli**: update test name for full release workflow [`cefd1e4`](https://github.com/kh4f/relion/commit/cefd1e4)
- **cli**: pass config directly to `runCli` as a parameter [`b4b5e5c`](https://github.com/kh4f/relion/commit/b4b5e5c)
- **cli**: remove timeouts [`3b7b5b6`](https://github.com/kh4f/relion/commit/3b7b5b6)
- **cli**: make test names clearer and consistent [`7bb3958`](https://github.com/kh4f/relion/commit/7bb3958)

##### &emsp;&ensp;&nbsp;&nbsp; [_All Release Commits_](https://github.com/kh4f/relion/compare/v0.13.0...v0.14.0) &ensp;•&ensp; _Sep 21, 2025_


## &ensp; [` 📦 v0.13.0  `](https://github.com/kh4f/relion/compare/v0.12.0...v0.13.0)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⚠️ BREAKING CHANGES
- The `releaseVersion` config option has been removed. Use `context.newVersion` instead to specify a custom release version.function to utilize `context.newVersion` for version determination <sup>[1]</sup>

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✨ Features
- **core, lifecycles**: add return values for improved testability [`ba18286`](https://github.com/kh4f/relion/commit/ba18286)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⚡ Performance
- **config-resolver**: optimize context resolution for already existing values [`6c93419`](https://github.com/kh4f/relion/commit/6c93419)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🚜 Refactoring
- **config**: change `extraArgs` option to allow null values [`cf3910f`](https://github.com/kh4f/relion/commit/cf3910f)
- **templater**: simplify `renderTemplate` function [`220de89`](https://github.com/kh4f/relion/commit/220de89)
- **utils**: extract `compilePartials` function to `templater` module [`fe46583`](https://github.com/kh4f/relion/commit/fe46583)
- **commit, tag**: improve command construction readability and logging [`e15b718`](https://github.com/kh4f/relion/commit/e15b718)
- **tsdown**: remove redundant `noExternal` option from cli config [`64bb035`](https://github.com/kh4f/relion/commit/64bb035)
- **config**: remove `releaseVersion` option and use `context.newVersion` instead [`9973c44`](https://github.com/kh4f/relion/commit/9973c44) ⚠️<sup>[1]</sup>

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🏷️ Types
- **commit**: change `RawCommit` type definition to use `string` directly instead of `CommitMessageString` [`f558ab9`](https://github.com/kh4f/relion/commit/f558ab9)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🛠️ Chores
- **package, ci**: specify `pnpm` version at 10.17.0 [`2f30a3e`](https://github.com/kh4f/relion/commit/2f30a3e)
- **renovate**: add backticks around `depName` in commit message topic [`26970db`](https://github.com/kh4f/relion/commit/26970db)
- **renovate**: remove caret from versions in commit message [`c034cba`](https://github.com/kh4f/relion/commit/c034cba)
- **renovate**: fix automerge configuration for v0.x dependencies [`010c51f`](https://github.com/kh4f/relion/commit/010c51f)
- **renovate**: configure semantic commit scope for `pnpm` updates [`4ba43e0`](https://github.com/kh4f/relion/commit/4ba43e0)
- **renovate**: enhance security with package age restriction for automerge [`fdfdc8e`](https://github.com/kh4f/relion/commit/fdfdc8e)

##### &emsp;&ensp;&nbsp;&nbsp; [_All Release Commits_](https://github.com/kh4f/relion/compare/v0.12.0...v0.13.0) &ensp;•&ensp; _Sep 20, 2025_


## &ensp; [` 📦 v0.12.0  `](https://github.com/kh4f/relion/compare/v0.11.0...v0.12.0)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⚠️ BREAKING CHANGES
- The `newTagFormat` option now uses simple string replacement with `{{version}}` placeholder instead of Handlebars template rendering. <sup>[1]</sup>

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🚜 Refactoring
- **config-resolver**: simplify `resolveContext` function [`1e60703`](https://github.com/kh4f/relion/commit/1e60703)
- **config-resolver**: update `groupCommitsByReleases` to use `prevReleaseTagPattern` directly [`8c23ec6`](https://github.com/kh4f/relion/commit/8c23ec6)
- **config**: update `newTagFormat` to use direct `{{version}}` substitution instead of hbs template [`06cadc7`](https://github.com/kh4f/relion/commit/06cadc7) ⚠️<sup>[1]</sup>
- **config-resolver**: rename `fillContext` function to `resolveContext` [`f1b0023`](https://github.com/kh4f/relion/commit/f1b0023)
- **changelog**: replace `prevTag` and `prevVersion` with unified `prevRelease` object [`d2d165f`](https://github.com/kh4f/relion/commit/d2d165f)
- **utils**: rename `getVersionFromTag` to `extractVersionFromTag` [`87c5c81`](https://github.com/kh4f/relion/commit/87c5c81)
- **utils**: move `getVersionFromTag` function to `versioner.ts` module [`badb78e`](https://github.com/kh4f/relion/commit/badb78e)
- **config-resolver**: inline `groupReleaseCommitsBySections` function into `groupCommitsByReleases` [`317a307`](https://github.com/kh4f/relion/commit/317a307)
- **utils**: rename `git-utils` module to `git-helper` [`158047c`](https://github.com/kh4f/relion/commit/158047c)
- **utils**: rename `version-manager` module to `versioner` [`2384b38`](https://github.com/kh4f/relion/commit/2384b38)
- **utils**: unify template rendering with `renderTemplate` function [`3e1afdc`](https://github.com/kh4f/relion/commit/3e1afdc)
- **templates**: remove unused `index.ts` module [`0afb9de`](https://github.com/kh4f/relion/commit/0afb9de)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🎨 Style
- **package**: group npm scripts by type [`15d2629`](https://github.com/kh4f/relion/commit/15d2629)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🚀 CI
- **release**: restrict tag pattern to 'v*' for release triggers [`527be49`](https://github.com/kh4f/relion/commit/527be49)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🏷️ Types
- **config**: remove `ContextualConfig` type and update `ResolvedConfig` definition [`273b1bc`](https://github.com/kh4f/relion/commit/273b1bc)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🛠️ Chores
- **eslint**: update global ignores to use 'temp/' instead of 'temp*/' [`23fb868`](https://github.com/kh4f/relion/commit/23fb868)
- **gitignore**: remove `temp.test.ts` from ignored files [`dacd529`](https://github.com/kh4f/relion/commit/dacd529)

##### &emsp;&ensp;&nbsp;&nbsp; [_All Release Commits_](https://github.com/kh4f/relion/compare/v0.11.0...v0.12.0) &ensp;•&ensp; _Sep 16, 2025_


## &ensp; [` 📦 v0.11.0  `](https://github.com/kh4f/relion/compare/v0.10.0...v0.11.0)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✨ Features
- **changelog**: add breaking change indicators [`cde45c0`](https://github.com/kh4f/relion/commit/cde45c0)
- **commit**: add `breakingChangeIndex` to `ResolvedCommit` for numbering breaking changes in changelog [`9b24b3f`](https://github.com/kh4f/relion/commit/9b24b3f)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🩹 Fixes
- **defaults**: correct regex for `revertCommitBodyPattern` to remove the trailing period [`c664157`](https://github.com/kh4f/relion/commit/c664157)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🚜 Refactoring
- **templates**: wrap changelog main section in `main` partial block [`b0d2ded`](https://github.com/kh4f/relion/commit/b0d2ded)
- **config-resolver**: use `.filter`for removing empty commit groups in `groupCommitsByType` [`018d88b`](https://github.com/kh4f/relion/commit/018d88b)
- **config-resolver**: simplify commit resolution logic [`78ed11c`](https://github.com/kh4f/relion/commit/78ed11c)
- **config-resolver**: rename `commitTypeGroupsMap` to `filledTypeGroupsMap` [`8e81abc`](https://github.com/kh4f/relion/commit/8e81abc)
- **config-resolver**: exclude `filter` from grouped section output [`14e05ba`](https://github.com/kh4f/relion/commit/14e05ba)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🎨 Style
- **templates**: improve indentation for better readability [`5e1921d`](https://github.com/kh4f/relion/commit/5e1921d)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🏷️ Types
- **config-resolver**: use imported `FilledTypeGroupMap` instead of local type definitions [`b844a3a`](https://github.com/kh4f/relion/commit/b844a3a)

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🛠️ Chores
- **eslint**: update `no-unused-vars` rule to ignore variables starting with `_` [`b239056`](https://github.com/kh4f/relion/commit/b239056)

##### &emsp;&ensp;&nbsp;&nbsp; [_All Release Commits_](https://github.com/kh4f/relion/compare/v0.10.0...v0.11.0) &ensp;•&ensp; _Sep 14, 2025_


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
