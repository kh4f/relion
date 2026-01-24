import { readFileSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { promptToContinue, strToRegex } from '@/utils'
import { defaultBumper } from '@/defaults'
import type { Config, Commit } from '@/types'

export const context = async (cfg: Required<Config>, commits: Commit[], curTag: string, newTag: string, repoURL: string) => {
	console.log(`About to write context to '${cfg.contextFile}'`)
	await promptToContinue()
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

export const bump = async (cfg: Required<Config>) => {
	const bumpers = cfg.bumpFiles.map(bumpFile => (
		typeof bumpFile == 'string' ? { ...defaultBumper, file: bumpFile } : bumpFile
	))
	console.log(`About to bump versions in files: ${bumpers.map(b => [b.file].flat()).flat().join(', ')}`)
	await promptToContinue()
	bumpers.forEach(bumper => {
		if (typeof bumper.pattern === 'string') bumper.pattern = strToRegex(bumper.pattern);
		[bumper.file].flat().forEach(file => {
			const fileContent = readFileSync(file, 'utf8')
			const updatedContent = fileContent.replace(bumper.pattern, bumper.replacement.replace('{{newVersion}}', cfg.newVersion))
			if (cfg.dryRun) return
			writeFileSync(file, updatedContent, 'utf8')
		})
	})
}

export const commit = async (cfg: Required<Config>) => {
	const cmd = `git commit -m "${cfg.commitMessage}"`
	console.log(`About to commit changes: '${cmd}'`)
	await promptToContinue()
	if (cfg.dryRun) return
	execSync(cmd, { stdio: 'inherit' })
}

export const tag = async (cfg: Required<Config>, newTag: string) => {
	const cmd = `git tag ${newTag} -m "${cfg.commitMessage}"`
	console.log(`About to create a tag: '${cmd}'`)
	await promptToContinue()
	if (cfg.dryRun) return
	execSync(cmd, { stdio: 'inherit' })
}