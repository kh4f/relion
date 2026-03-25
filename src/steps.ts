import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { promptToContinue } from '@/utils'
import { defBumpers } from '@/defaults'
import type { ResolvedCfg, Commit } from '@/types'

export const context = async (cfg: ResolvedCfg, commits: Commit[], curTag: string, newTag: string, repoURL: string) => {
	if (!await promptToContinue(`About to write context to 'RELEASE.md'`, cfg.yes)) return
	if (cfg.dryRun) return
	let output = ''
	const frontMatter = '---'
		+ `\ntag: ${newTag}`
		+ `\nprevTag: ${curTag}`
		+ `\ndate: ${new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
		+ `\nrepoURL: ${repoURL}`
		+ '\n---\n'
	output += frontMatter + '\n'
	const commitLog = commits.map(c => `[${c.hash}] ${c.message}`).join(`\n${'-'.repeat(30)}\n`)
	output += `## Commit Log\n\n\`\`\`\n${commitLog}\n\`\`\``
	writeFileSync('RELEASE.md', output, 'utf8')
}

export const bump = async (cfg: ResolvedCfg) => {
	const files = cfg.bump.filter(existsSync)
	if (!await promptToContinue(`About to bump version in files: ${files.join(', ')}`, cfg.yes)) return

	files.forEach(file => {
		const bumper = defBumpers.find(b => b.filePattern.test(file))
		if (!bumper) return console.warn(`No matching bumper found for file '${file}', skipping...`)

		const content = readFileSync(file, 'utf8')
		const updated = bumper.bump(content, cfg.newVersion)
		if (cfg.dryRun) return
		writeFileSync(file, updated, 'utf8')
	})
}

export const commit = async (cfg: ResolvedCfg, commitMsg: string) => {
	const cmd = `git commit -m "${commitMsg}"`

	if (!await promptToContinue(`About to commit changes: '${cmd}'`, cfg.yes)) return

	if (cfg.dryRun) return
	execSync(cmd, { stdio: 'inherit' })
}

export const tag = async (cfg: ResolvedCfg, newTag: string, commitMsg: string) => {
	const cmd = `git tag ${newTag} -m "${commitMsg}"`

	if (!await promptToContinue(`About to create a tag: '${cmd}'`, cfg.yes)) return

	if (cfg.dryRun) return
	execSync(cmd, { stdio: 'inherit' })
}