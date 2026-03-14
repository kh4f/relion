import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { promptToContinue } from '@/utils'
import type { ResolvedCfg, Commit } from '@/types'

export const context = async (cfg: ResolvedCfg, commits: Commit[], curTag: string, newTag: string, repoURL: string) => {
	if (!await promptToContinue(`About to write context to 'RELEASE.md'`)) return
	if (cfg.dryRun) return
	let output = ''
	const frontMatter = '---'
		+ `\ntag: ${newTag}`
		+ `\nprevTag: ${curTag}`
		+ `\ndate: ${new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
		+ `\nrepoURL: ${repoURL}`
		+ '\n---\n'
	output += frontMatter + '\n'
	const commitsString = commits.map(c => `[${c.hash}] ${c.message}`).join(`\n${'-'.repeat(30)}\n`)
	output += `## Commit Log\n\n\`\`\`\n${commitsString}\n\`\`\``
	writeFileSync('RELEASE.md', output, 'utf8')
}

export const bump = async (cfg: ResolvedCfg) => {
	const files = cfg.bump.filter(existsSync)

	if (!await promptToContinue(`About to bump version in files: ${files.join(', ')}`)) return

	files.forEach(file => {
		const content = readFileSync(file, 'utf8')
		const updated = content.replace(/(\bversion\b.*?)\d[\w.+-]*/, `$1${cfg.newVersion}`)
		if (cfg.dryRun) return
		writeFileSync(file, updated, 'utf8')
	})
}

export const commit = async (cfg: ResolvedCfg) => {
	const cmd = `git commit -m "${cfg.commitMessage}"`

	if (!await promptToContinue(`About to commit changes: '${cmd}'`)) return

	if (cfg.dryRun) return
	execSync(cmd, { stdio: 'inherit' })
}

export const tag = async (cfg: ResolvedCfg, curTag: string, newTag: string) => {
	const cmd = `git tag ${newTag} -m "${cfg.commitMessage}"`

	if (!await promptToContinue(`About to create a tag: '${cmd}'`)) return

	if (cfg.dryRun) return
	execSync(cmd, { stdio: 'inherit' })
}