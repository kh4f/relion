#!/usr/bin/env node
import { relion } from './relion'

const HELP = `Usage: relion [options]

Options:
  -b <files>    Files to bump version in
  -v <version>  Set the new version explicitly
  -m <file>     Specify manifest file
  -d            Run in dry run mode
  -h            Show the help message

Examples:
- \`bun relion -m Cargo.toml\` — use \`Cargo.toml\` as manifest
- \`bun relion -b src/manifest.json\` — also bump version in specified files
`

const args = process.argv.slice(2).join(' ')

if (args.includes('-h')) {
	console.log(HELP)
	process.exit(0)
}

const manifest = /-m (\S+)/.exec(args)?.[1]
const bump = /-b (.+?)( -|$)/.exec(args)?.[1].split(' ')
const newVersion = /-v (\S+)/.exec(args)?.[1]
const dryRun = /-\w*d/.test(args)

void relion({
	...(manifest && { manifest }),
	...(bump && { bump }),
	...(newVersion && { newVersion }),
	...(dryRun && { dryRun }),
}).catch((err: unknown) => {
	console.error(err)
	process.exit(1)
})