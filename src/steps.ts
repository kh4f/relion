import { readFileSync, writeFileSync } from 'node:fs'
import { defaultBumpers } from '@/defaults'
import type { Config, Commit } from '@/types'
import { execSync } from 'node:child_process'

export const bump = (cfg: Required<Config>) => {
	cfg.bumpFiles.forEach(bumpFile => {
		const bumper = typeof bumpFile == 'string'
			? defaultBumpers.find(b => b.file === bumpFile) ?? (() => {
				throw new Error(`No default bumper found for file '${bumpFile}'`)
			})()
			: bumpFile

		const fileContent = readFileSync(bumper.file, 'utf8')
		const updatedContent = fileContent.replace(bumper.pattern, bumper.replacement.replace('{{newVersion}}', cfg.newVersion))
		console.log(`Updating version in '${bumper.file}'`)
		if (cfg.dryRun) return
		writeFileSync(bumper.file, updatedContent, 'utf8')
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
	output += `## Git Log\n\n\`\`\`\n${commitsString}\n\`\`\``
	writeFileSync(cfg.contextFile, output, 'utf8')
}

export const commit = (cfg: Required<Config>): void => {
	const cmd = `git add -A && git reset ${cfg.contextFile} && git commit -m "${cfg.commitMessage}"`
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