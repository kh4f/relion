<div align="center">
	<picture>
		<source media="(prefers-color-scheme: dark)" srcset=".github/logo-dark.png">
		<img alt="logo" src=".github/logo-light.png">
	</picture>
	<br>
	<a href="https://www.npmjs.com/package/relion"><img src="https://img.shields.io/npm/v/relion?label=npm&logo=npm&style=flat-square&color=B2BFFF&labelColor=303145" alt="npm version"/></a>&nbsp;
	<a href="https://www.npmjs.com/package/relion"><img src="https://img.badgesize.io/https:/unpkg.com/relion/dist/cli.js?label=Size&logo=hackthebox&logoColor=c97026&style=flat-square&color=B2BFFF&labelColor=303145" alt="runtime size"/></a>&nbsp;
	<a href="https://github.com/kh4f/relion/blob/master/LICENSE"><img src="https://img.shields.io/github/license/kh4f/relion?style=flat-square&label=%F0%9F%9B%A1%EF%B8%8F%20License&color=B2BFFF&labelColor=303145" alt="license"></a>&nbsp;
	<a href="https://github.com/kh4f/relion/issues?q=is%3Aissue+is%3Aopen+label%3Abug"><img src="https://img.shields.io/github/issues/kh4f/relion/bug?label=%F0%9F%90%9B%20Bugs&style=flat-square&color=B2BFFF&labelColor=303145" alt="open bugs"></a>
	<br><br>
	<b>A minimal npm library for automating release workflow:<br></b> version bumping, release commit & tag creation, and AI‑assisted changelog generation
	<br><br>
	<p><b>
		<a href="#%EF%B8%8F-usage">Usage</a>&nbsp; •&nbsp;
		<a href="#%EF%B8%8F-workflow-steps">Workflow Steps</a>&nbsp; •&nbsp;
		<a href="#-changelog-generation">Changelog Generation</a>
	</b></p>
	<br>
</div>

## 🕹️ Usage

```bash
$ bunx relion -h

Usage: relion [options]

Options:
  -b <files>    Files to bump version in (def: ['package.json']; package.json is always included if exists)
  -v <version>  Release version (def: calculated from commits)
  -t <prefix>   Tag prefix (def: 'v')
  -d            Dry run (def: false)

Examples:
- `bunx relion -b src/manifest.json`
- `bunx relion -d -v 1.2.3`
```

<details><summary>Example output of running <code>bunx relion</code>:</summary>

```
Project: relion
Repo: github.com/kh4f/relion
Current tag: v0.42.1
Current version: 0.42.1
Parsed commits: 26
New version: 0.43.0
New tag: v0.43.0
------------------------------

('' to continue / 's' to skip)
About to write context to 'RELEASE.md'
About to bump version in files: package.json
About to commit changes: 'git commit -m "chore(release): v0.43.0"'
About to create a tag: 'git tag v0.43.0 -m "chore(release): v0.43.0"'
```
</details>

## ♻️ Workflow Steps

- **Context**: generates a `RELEASE.md` file with upcoming release metadata and commit log
- **Bump**: updates version in specified files
- **Commit**: creates a release commit
- **Tag**: creates an annotated release tag

<details><summary>Generated release context example (*):</summary>

```md
---
tag: v0.33.0
prevTag: v0.32.1
date: Jan 10, 2026
repoURL: github.com/kh4f/relion
---

## Commit Log

[8f29acf] fix(versioner): ensure breaking changes take priority over features in release type calculation

Previously, if commits contained both features and breaking changes, features would be checked last and could incorrectly override the 'major' release type with 'minor'.
------------------------------
[e105d51] feat(config-merger): add `mergeConfigs` implementation and export

- Implement `mergeConfigs` to support merging config profiles in `config-merger.ts`
- Export `mergeConfigs` from `src/index.ts`
```
</details>

## 📚 Changelog Generation

Relion doesn’t format the changelog itself — it produces a release context that can be turned into a user‑friendly changelog with AI.

Recommended workflow:

1. Set up GitHub Copilot instruction and prompt:
   - [.github/instructions/changelog-format.instructions.md](.github/instructions/changelog-format.instructions.md)
   - [.github/prompts/generate-changelog.prompt.md](.github/prompts/generate-changelog.prompt.md)
2. Run Relion to generate `RELEASE.md` with the release context
3. Review the release context, adjust as needed
4. Run the prompt in VSCode Copilot chat: `/generate-changelog`
5. Copilot produces a polished changelog entry based on the release context

<details><summary>Generated changelog example (from the (*) release context using the instruction and prompt above; Gemini 3 Pro)</summary>

```md
## &ensp; [` 📦 v0.33.0  `](https://github.com/kh4f/relion/compare/v0.32.1...v0.33.0)

### &emsp; 🎁 Features
- **Config merging utility**: added `mergeConfigs` implementation to support merging config profiles. [🡥](https://github.com/kh4f/relion/commit/e105d51)

### &emsp; 🩹 Fixes
- **Correct release type calculation**: breaking changes now correctly take priority over features when determining the release type, preventing incorrect minor bumps. [🡥](https://github.com/kh4f/relion/commit/8f29acf)

##### &emsp;&emsp; [Full Changelog](https://github.com/kh4f/relion/compare/v0.32.1...v0.33.0) &ensp;•&ensp; Jan 10, 2026
```
</details>

</br>

<div align="center">
  <b>MIT License © 2025-2026 <a href="https://github.com/kh4f">kh4f</a></b>
</div>