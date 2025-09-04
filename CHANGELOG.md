# Changelog


## [v0.2.0](https://github.com/Kh4f/relion/compare/v0.1.1...v0.2.0) (2025-09-04)

> [!NOTE]
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
