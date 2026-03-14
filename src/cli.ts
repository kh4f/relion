#!/usr/bin/env node
import { relion } from './relion'
import type { Step } from '@/types'

const HELP = `Usage: relion [options]

Options:
  -f            Prepare release context
  -b            Bump the version
  -c            Create a release commit
  -t            Create a release tag
  -v <version>  Set the new version explicitly
  -m <file>     Specify manifest file
  -d            Run in dry run mode
  -h            Show the help message

Examples:
- \`bun relion -bct\` — bump version, create release commit and tag
- \`bun relion -f\` — generate release context file
- \`bun relion -m Cargo.toml\` — use Cargo.toml as manifest
- \`bun relion\` — run all release steps
`

const args = process.argv.slice(2).join(' ')

if (args.includes('-h')) {
	console.log(HELP)
	process.exit(0)
}

let flow: Step[] = [
	/-\w*f/.test(args) && 'context',
	/-\w*b/.test(args) && 'bump',
	/-\w*c/.test(args) && 'commit',
	/-\w*t/.test(args) && 'tag',
].filter(Boolean) as Step[]
if (!flow.length) flow = ['context', 'bump', 'commit', 'tag']

const newVersion = /-v (\S+)/.exec(args)?.[1]
const manifest = /-m (\S+)/.exec(args)?.[1]
const dryRun = /-\w*d/.test(args)

void relion({
	flow: flow,
	...(newVersion && { newVersion }),
	...(manifest && { manifest }),
	...(dryRun && { dryRun }),
}).catch((err: unknown) => {
	console.error(err)
	process.exit(1)
})