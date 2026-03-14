#!/usr/bin/env node
import { relion } from './relion'

const HELP = `Usage: relion [options]

Options:
  -b <files>    Files to bump version in (def: ['package.json']; package.json is always included if exists)
  -v <version>  Release version (def: calculated from commits)
  -t <prefix>   Tag prefix (def: 'v')
  -d            Dry run (def: false)

Examples:
- \`bunx relion -b src/manifest.json\`
- \`bunx relion -d -v 1.2.3\`
`

const args = process.argv.slice(2).join(' ')

if (args.includes('-h')) {
	console.log(HELP)
	process.exit(0)
}

const bump = /-b (.+?)( -|$)/.exec(args)?.[1].split(' ')
const newVersion = /-v (\S+)/.exec(args)?.[1]
const tagPrefix = /-t (\S+)/.exec(args)?.[1]
const dryRun = /-\w*d/.test(args)

void relion({
	...(bump && { bump }),
	...(newVersion && { newVersion }),
	...(tagPrefix && { tagPrefix }),
	...(dryRun && { dryRun }),
}).catch((err: unknown) => {
	console.error(err)
	process.exit(1)
})