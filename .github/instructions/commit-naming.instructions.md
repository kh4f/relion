# Commit Naming Guidelines

- Use English
- Use present tense, imperative mood, and lowercase in the commit `subject`
- Commit format: `<type>(<scope>): <subject>\n\n[body]\n\n[footer]` (scope is always required)
- Use the following commit types:
  - feat (new feature)
  - fix (bug fix)
  - refactor (code improvement without affecting functionality, restructuring code...)
  - style (formatting, styling or visual aspects)
  - perf (performance improvement)
  - docs (documentation change)
  - chore (maintenance change, e.g., tooling, dependencies, scripts...)
  - test (test change)
  - build (build system change)
  - ci (CI change)
  - release (package release)
  - revert (commit revert)
- Add a `body` if the subject needs more context or a clearer explanation of the reason for the change
- If the `subject` is too broad and covers multiple changes, add a `body` as a bullet list of changes
- If the commit references an Issue/PR (I’ll let you know), include a footer
- If the commit introduces breaking changes (I’ll let you know), add a `BREAKING CHANGES: ...` section between the body (if present) and the footer (if present), separated by empty lines. Also, add a `!` before the colon in the commit header
- Use backticks for file, folder, component, function, library and other code entity names, suffixes, etc.


## Examples

- chore(copilot): add commit naming guidelines with examples
- chore(copilot): add initial instructions with project description
- feat(config)!: add support for `_<profileName>` profiles with CLI `--profile` flag
  BREAKING CHANGE: Changed alias for 'prerelease' option to 'P' to reserve 'p' for the new '--profile' option.
  Refs #45 (support for multiple profiles)
- ci(checks): add initial CI workflow
- style(templates): add backtick quotes around `footer` partial
- build(tsdown): add `tsdown` build script and configuration
- refactor(options)!: remove `packageFiles` option and related logic
  BREAKING CHANGE: The `packageFiles` option has been removed. The current version is now always read from `package.json`.
- ci(release): add `--no-git-checks` flag to npm publish command
- refactor(core): simplify conditional lifecycle calls
- refactor(pages): move `page.tsx` from `app` to `home`
- refactor(homepage): replace CSS modules with `linaria` for styling
- feat(cli): add `context.linkReferences` option
- refactor(styles): move global styles from `page.module.css` to `globals.css`
- chore(eslint): add name to global ignores
- chore(tsconfig): update `jsx` setting to use 'react-jsx'
- fix(root): add `suppressHydrationWarning` property to `html` tag
  Fixes #12 (error during hydration)
  Refs #34 (conflict with chrome extension)
- chore(root): update `metadata` with project title and description
- chore(package): update lint script to use `eslint` instead of `next lint`
- release(relion): v1.0.0-rc.1
- chore(eslint): enhance TypeScript and React rules
- chore(vscode): add workspace settings for file exclusion
- chore(gitignore): remove `next-env.d.ts` from ignored files
- style(codebase): apply consistent formatting across the codebase
- release(verdox): v0.1.0
- chore(eslint): migrate config to TypeScript and add Type-Aware Rules
- chore(deps): update all dependencies to latest versions
- chore(eslint): add `@typescript-eslint/no-unused-vars` rule with warning level
- chore(nextjs): add postinstall patch to prevent Next.js from modifying tsconfig
- chore(dev-deps): add `tsx` and update pnpm workspace settings
- chore(tsconfig): clean up configuration
- style(package): normalize indentation
- chore(package): set initial version to 0.0.0
- chore(project): setup repo with `create-next-app`