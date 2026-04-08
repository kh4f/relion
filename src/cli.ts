#!/usr/bin/env node
import { relion } from './relion'

const HELP = `Usage: relion [options]

Options:
  -b <files>    Files to bump the version in ['package.json']
  -v <version>  Release version [calculated from commits]
  -t <prefix>   Tag prefix [v]
  -d            Dry run [false]
  -y            Skip prompts [false]

Examples:
  bunx relion -b src/manifest.json  Bump a custom file
  bunx relion -d -v 1.2.3           Dry run with a custom version
`

const args = process.argv.slice(2).join(' ')

if (args.includes('-h')) {
	console.log(HELP)
	process.exit(0)
}

const bump = /-b (.+?)( -|$)/.exec(args)?.[1].split(' ')
const newVersion = /-v (\S+)/.exec(args)?.[1]
let tagPrefix = /-t (\S+)/.exec(args)?.[1]
if (tagPrefix === `''`) tagPrefix = ''
const dryRun = /\b-d\b/.test(args)
const yes = /\b-y\b/.test(args)

void relion({
	...(bump && { bump }),
	...(newVersion && { newVersion }),
	...(tagPrefix && { tagPrefix }),
	dryRun,
	yes,
}).catch((err: unknown) => {
	console.error(err)
	process.exit(1)
})