<div align="center">
	<img src=".github/logo.png" alt="logo"/>
	<br><br>
	<a href="https://www.npmjs.com/package/relion"><img src="https://img.shields.io/npm/v/relion?label=npm&logo=npm&style=flat-square&color=c8c9f1&labelColor=363a4f" alt="npm version"/></a>&nbsp;
	<a href="https://bundlephobia.com/package/relion"><img src="https://img.shields.io/bundlephobia/minzip/relion?label=%F0%9F%93%A6%20Size&style=flat-square&color=c8c9f1&labelColor=363a4f" alt="bundle size"/></a>&nbsp;
	<a href="https://github.com/kh4f/relion/blob/master/LICENSE"><img src="https://img.shields.io/github/license/kh4f/relion?style=flat-square&label=%F0%9F%9B%A1%EF%B8%8F%20License&color=c8c9f1&labelColor=363a4f" alt="license"></a>&nbsp;
	<a href="https://github.com/kh4f/relion/issues?q=is%3Aissue+is%3Aopen+label%3Abug"><img src="https://img.shields.io/github/issues/kh4f/relion/bug?label=%F0%9F%90%9E%20Bugs&style=flat-square&color=c8c9f1&labelColor=363a4f" alt="open bugs"></a>
	<br><br><br>
	<b>A minimal npm library for automating release workflow:</b><br>version bumping, release commit & tag creation, and AI‑assisted changelog generation.
	<br><br>
	<p>
		<b>
			<a href="#-installation">Installation</a>&nbsp; •&nbsp; 
			<a href="#-cli-usage">CLI</a>&nbsp; •&nbsp; 
			<a href="#-api-usage">API</a>&nbsp; •&nbsp; 
			<a href="#%EF%B8%8F-workflow-steps">Workflow Steps</a>&nbsp; •&nbsp; 
			<a href="#-changelog-generation">Changelog Generation</a>
		</b>
	</p>
	<br>
</div>

## 📥 Installation

```bash
pnpm add -D relion
```

## 🚀 CLI Usage
Running the CLI without arguments prints help

```bash
$ pnpm relion

Usage: relion [options]

Options:
  -b            Bump the version
  -f            Prepare release context
  -c            Create a release commit
  -t            Create a release tag
  -v <version>  Set the new version explicitly
  -d            Run in dry run mode

Examples:
- `pnpm relion -bct` — bump version, create release commit and tag
- `pnpm relion -f` — generate release context file
```

## 🧩 API Usage

```ts
import relion from 'relion';

relion({
	flow: ['bump', 'context', 'commit', 'tag'],
	newVersion: '1.2.3',
	bumpFiles: [
		'package.json', // uses default bumper
		// custom bumper
		{
			file: 'manifest.json', 
			pattern: /("version": )".*"/, 
			replacement: '$1"{{newVersion}}"' 
		} 
	],
	contextFile: 'RELEASE.md',
	commitMessage: 'chore(release): {{tag}}',
	tagPrefix: 'v',
	commitFilters: [/^feat|^fix/, 'BREAKING CHANGE'],
	dryRun: false,
});
```

### Options

- `flow`: release workflow steps (`'bump' | 'context' | 'commit' | 'tag'`) (default: `[]`)
- `newVersion`: set the new version explicitly
- `bumpFiles`: files or custom bumpers for version update (default: `['package.json']`)
- `contextFile`: path to release context output file (default: `'RELEASE.md'`)
- `commitMessage`: release commit message template (default: `'chore(release): {{tag}}'`)
- `tagPrefix`: release tag prefix (default: `'v'`)
- `commitFilters`: commit log filters (substring or RegExp; default: [`/^feat|^fix|^perf|^style|^docs/`, `'BREAKING CHANGE'`])
- `dryRun`: run in dry mode (no modifications)

### Configuration via `package.json`

Relion can also be configured via `relion` field in `package.json`:

```jsonc
{
  // ...
  "relion": {
    "commitMessage": "release(relion): {{tag}}",
    "tagPrefix": ""
    // ...
  }
}
```

> [!NOTE]
> CLI flags override `package.json` configuration.

## ♻️ Workflow Steps

- **Bump**: updates version in specified files
- **Context**: generates a file with upcoming release metadata and commit log
- **Commit**: creates a release commit (release context file is not committed)
- **Tag**: creates an annotated release tag

<details><summary>Generated release context example (*):</summary>

```md
---
version: 0.33.0
tag: v0.33.0
date: Jan 10, 2026
prevTag: v0.32.1
repoURL: https://github.com/kh4f/relion
---

## Commit Log

[8f29acf] fix(versioner): ensure breaking changes take priority over features in release type calculation

Previously, if commits contained both features and breaking changes, features would be checked last and could incorrectly override the 'major' release type with 'minor'.
------------------------------
[e105d51] feat(config-merger): add `mergeConfigs` implementation and export

- Implement `mergeConfigs` to support merging config profiles in `config-merger.ts`
- Export `mergeConfigs` from `src/index.ts`
------------------------------
```
</details>

## 📚 Changelog Generation

Relion doesn’t format the changelog itself — it produces a release context that can be turned into a user‑friendly changelog with AI.

Recommended workflow:

1. Set up GitHub Copilot instructions and prompt:
   - [.github/instructions/changelog-format.instructions.md](.github/instructions/changelog-format.instructions.md)
   - [.github/prompts/generate-changelog.prompt.md](.github/prompts/generate-changelog.prompt.md)
2. Run the context step to generate RELEASE.md: `pnpm relion -f`
3. Run the prompt in VSCode Copilot chat: `/generate-changelog`
4. Copilot produces a polished changelog entry based on the release context

<details><summary>Generated changelog example (from the (*) release context using the instructions and prompt above; Gemini 3 Pro)</summary>

```md
## &ensp; [` 📦 v0.33.0  `](https://github.com/kh4f/relion/compare/v0.32.1...v0.33.0)

### &emsp; 🎁 Features
- **Config merging utility**: added `mergeConfigs` implementation to support merging config profiles. [🡥](https://github.com/kh4f/relion/commit/e105d51)

### &emsp; 🩹 Fixes
- **Correct release type calculation**: breaking changes now correctly take priority over features when determining the release type, preventing incorrect minor bumps. [🡥](https://github.com/kh4f/relion/commit/8f29acf)

##### &emsp;&emsp; [_Full Changelog_](https://github.com/kh4f/relion/compare/v0.32.1...v0.33.0) &ensp;•&ensp; _Jan 10, 2026_
```
</details>

</br>

<div align="center">
  <b>MIT License © 2025-2026 <a href="https://github.com/kh4f">kh4f</a></b>
</div>