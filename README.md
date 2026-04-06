<div align="center">
	<picture>
		<source media="(prefers-color-scheme: dark)" srcset=".github/logo-dark.png">
		<img alt="logo" src=".github/logo-light.png">
	</picture>
	<br>
	<a href="https://www.npmjs.com/package/relion"><img src="https://img.shields.io/npm/v/relion?label=npm&logo=npm&style=flat-square&color=BCC7EC&labelColor=303145" alt="npm version"/></a>&nbsp;
	<a href="https://www.npmjs.com/package/relion"><img src="https://img.badgesize.io/https:/unpkg.com/relion/dist/cli.js?label=Size&logo=hackthebox&logoColor=c97026&style=flat-square&color=BCC7EC&labelColor=303145" alt="bundle size"/></a>&nbsp;
	<a href="https://github.com/kh4f/relion/issues?q=is%3Aissue+is%3Aopen+label%3Abug"><img src="https://img.shields.io/github/issues/kh4f/relion/bug?label=%F0%9F%90%9B%20Bugs&style=flat-square&color=BCC7EC&labelColor=303145" alt="open bugs"></a>
	<br><br>
	<b>A zero‑config npm lib for automating the release workflow:<br></b> version bumping, release commit & tag creation, and AI‑assisted changelog generation
	<br><br>
	<p><b>
		<a href="#%EF%B8%8F-usage">Usage</a>&nbsp; •&nbsp;
		<a href="#%EF%B8%8F-release-workflow">Release Workflow</a>&nbsp; •&nbsp;
		<a href="#-changelog-generation">Changelog Generation</a>
	</b></p>
</div>

## 🕹️ Usage

```bash
$ bunx relion -h

Options:
  -b <files>    Files to bump the version in ['package.json']
  -v <version>  Release version [calculated from commits]
  -t <prefix>   Tag prefix [v]
  -d            Dry run [false]
  -y            Skip prompts [false]

Examples:
  bunx relion -b src/manifest.json  Bump a custom file
  bunx relion -d -v 1.2.3           Dry run with a custom version
```

- `package.json` is **always included** in the bump list if exists
- to create a tag without a prefix, use `-t ''`

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

## ♻️ Release Workflow

1. **Context**: generates a `RELEASE.md` file with upcoming release metadata and commit log  
	The log is [automatically filtered](tests/context.test.ts) to exclude non-user-facing commits.
2. **Bump**: updates version in specified files  
	Most files are bumped with a [generic pattern](https://regex101.com/r/t570Gh/1); `.rc` files use a dedicated one.
3. **Commit**: creates a release commit  
	Changes are **not staged automatically** before committing, unless `-y` is passed.
4. **Tag**: creates an annotated release tag

<details><summary>Generated release context example (*):</summary>

```markdown
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

## 📋 Changelog Generation

Relion doesn’t format the changelog itself. Instead, it generates a `RELEASE.md` file with release metadata and commit log, and provides a [`generate-changelog`](skills/generate-changelog/SKILL.md) skill to turn that context into a polished changelog entry with AI.

Recommended workflow:

1. Install the skill: `bunx skills add kh4f/relion [-g]`  
  (see the [`skills` CLI docs](https://www.npmjs.com/package/skills))
2. Run Relion to generate `RELEASE.md`
3. Review the generated release context
4. Ask your AI agent to generate a changelog

<details><summary>Generated changelog example (from the (*) release context; Gemini 3 Pro)</summary>

```markdown
## &ensp; [` 📦 v0.33.0  `](https://github.com/kh4f/relion/compare/v0.32.1...v0.33.0)

### &emsp; 🎁 Features
- **Config merging utility**: added `mergeConfigs` implementation to support merging config profiles. [🡥](https://github.com/kh4f/relion/commit/e105d51)

### &emsp; 🩹 Fixes
- **Correct release type calculation**: breaking changes now correctly take priority over features when determining the release type, preventing incorrect minor bumps. [🡥](https://github.com/kh4f/relion/commit/8f29acf)

##### &emsp;&emsp; [Full Changelog](https://github.com/kh4f/relion/compare/v0.32.1...v0.33.0) &ensp;•&ensp; Jan 10, 2026
```
</details>