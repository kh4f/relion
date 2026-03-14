#!/usr/bin/env node
import { relion } from './relion'

const HELP = `Usage: relion [options]

Options:
  -b <files>    Files to bump version in
  -v <version>  Set the new version explicitly
  -d            Run in dry run mode

Examples:
- \`bun relion -b src/manifest.json\`
- \`bun relion -d -v 1.2.3\`
`

const args = process.argv.slice(2).join(' ')

if (args.includes('-h')) {
	console.log(HELP)
	process.exit(0)
}

const bump = /-b (.+?)( -|$)/.exec(args)?.[1].split(' ')
const newVersion = /-v (\S+)/.exec(args)?.[1]
const dryRun = /-\w*d/.test(args)

void relion({
	...(bump && { bump }),
	...(newVersion && { newVersion }),
	...(dryRun && { dryRun }),
}).catch((err: unknown) => {
	console.error(err)
	process.exit(1)
})