import relion from './index.js'
import type { Step } from '@/types'

const HELP = `Usage: relion [options]

Options:
  -f            Prepare release context
  -b            Bump the version
  -c            Create a release commit
  -t            Create a release tag
  -v <version>  Set the new version explicitly
  -d            Run in dry run mode
  -h            Show the help message

Examples:
- \`pnpm relion -bct\` — bump version, create release commit and tag
- \`pnpm relion -f\` — generate release context file
- \`pnpm relion\` — run all release steps
`

const args = process.argv.slice(2).join(' ')

if (args.includes('-h')) {
	console.log(HELP)
	process.exit(0)
}

const flow: Step[] = !args ? ['context', 'bump', 'commit', 'tag'] : [
	/-\w*f/.test(args) && 'context',
	/-\w*b/.test(args) && 'bump',
	/-\w*c/.test(args) && 'commit',
	/-\w*t/.test(args) && 'tag',
].filter(Boolean) as Step[]
const newVersion = /-v (\S+)/.exec(args)?.[1]
const dryRun = /-\w*d/.test(args)

void relion({
	flow: flow,
	...(newVersion && { newVersion }),
	...(dryRun && { dryRun }),
})