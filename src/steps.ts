import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { strToRegex } from '@/utils'
import { defaultBumper } from '@/defaults'
import type { Config, Commit } from '@/types'

export const bump = (cfg: Required<Config>) => {
	cfg.bumpFiles.forEach(bumpFile => {
		const bumper = typeof bumpFile == 'string' ? defaultBumper : bumpFile
		if (typeof bumper.pattern === 'string') bumper.pattern = strToRegex(bumper.pattern);
		[bumper.file].flat().forEach(file => {
			const fileContent = readFileSync(file, 'utf8')
			const updatedContent = fileContent.replace(bumper.pattern, bumper.replacement.replace('{{newVersion}}', cfg.newVersion))
			console.log(`Updating version in '${file}'`)
			if (cfg.dryRun) return
			writeFileSync(file, updatedContent, 'utf8')
		})
	})
}

export const context = (cfg: Required<Config>, commits: Commit[], curTag: string, newTag: string, repoURL: string) => {
	console.log(`Outputting release context to '${cfg.contextFile}'`)
	if (cfg.dryRun) return
	let output = ''
	const frontMatter = '---'
		+ `\nversion: ${cfg.newVersion}`
		+ `\ntag: ${newTag}`
		+ `\ndate: ${new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
		+ `\nprevTag: ${curTag}`
		+ `\nrepoURL: ${repoURL}`
		+ '\n---\n'
	output += frontMatter + '\n'
	const commitsString = commits.map(c => `[${c.hash}] ${c.message}`).join(`\n${'-'.repeat(30)}\n`)
	output += `## Commit Log\n\n\`\`\`\n${commitsString}\n\`\`\``
	writeFileSync(cfg.contextFile, output, 'utf8')
}

export const commit = (cfg: Required<Config>): void => {
	const cmd = 'git add -A'
		+ (existsSync(cfg.contextFile) ? ` && git reset ${cfg.contextFile}` : '')
		+ ` && git commit -m "${cfg.commitMessage}"`
	console.log(`Committing changes: '${cmd}'`)
	if (cfg.dryRun) return
	execSync(cmd, { stdio: 'inherit' })
}

export const tag = (cfg: Required<Config>, newTag: string) => {
	const cmd = `git tag ${newTag} -m "${cfg.commitMessage}"`
	console.log(`Creating a tag: '${cmd}'`)
	if (cfg.dryRun) return
	execSync(cmd, { stdio: 'inherit' })
}