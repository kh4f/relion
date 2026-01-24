import { readFileSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { promptToContinue, strToRegex } from '@/utils'
import { defaultBumper } from '@/defaults'
import type { Config, Commit } from '@/types'

export const context = async (cfg: Required<Config>, commits: Commit[], curTag: string, newTag: string, repoURL: string) => {
	console.log(`\nAbout to write context to '${cfg.contextFile}'`)
	if (!await promptToContinue()) return
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
	console.log(`\nAbout to bump versions in files: ${bumpers.map(b => [b.file].flat()).flat().join(', ')}`)
	if (!await promptToContinue()) return
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
	console.log(`\nAbout to commit changes: '${cmd}'`)
	if (!await promptToContinue()) return
	if (cfg.dryRun) return
	execSync(cmd, { stdio: 'inherit' })
}

export const tag = async (cfg: Required<Config>, curTag: string, newTag: string) => {
	let cmd = `git tag ${newTag} -m "${cfg.commitMessage}"`
	const prevReleaseCommitPattern = new RegExp(`^${cfg.commitMessage.replace('{{tag}}', curTag).replace(/[()]/g, '\\$&')}$`)
	const latestCommit = execSync('git log -1 --format=%s', { encoding: 'utf8' }).trim()
	if (prevReleaseCommitPattern.test(latestCommit)) {
		console.log('Latest commit is a release commit. Reusing the latest tag.')
		cmd = `git tag ${curTag} -m "${latestCommit}" -f`
	}
	console.log(`\nAbout to create a tag: '${cmd}'`)
	if (!await promptToContinue()) return
	if (cfg.dryRun) return
	execSync(cmd, { stdio: 'inherit' })
}