#!/usr/bin/env node
import { relion } from './relion'
import type { Step } from './types'

const STEPS: Step[] = ['context', 'bump', 'commit', 'tag']
const STEP_ALIASES: Record<Step, string> = { context: 'c', bump: 'b', commit: 'm', tag: 't' }

const HELP = `Usage: relion [steps] [options]

Steps (first positional argument, e.g. "bm" = bump+commit):
  c  context   Generate RELEASE.md
  b  bump      Bump version in files
  m  commit    Commit changes
  t  tag       Create git tag
  (omit to run all steps)

Options:
  -b <files>    Files to bump the version in ['package.json']
  -v <version>  Release version [calculated from commits]
  -t <prefix>   Tag prefix [v]
  -d            Dry run [false]
  -y            Skip prompts [false]

Examples:
  bunx relion bm -t v           Bump and commit with tag prefix v
  bunx relion ct -v 0.0.1       Generate context and tag with version
  bunx relion -b src/manifest.json  Bump a custom file
  bunx relion -d -v 1.2.3       Dry run with a custom version
`

const args = process.argv.slice(2)

const stepsArg = args[0] ? args.shift() : ''

if (args.includes('-h')) {
	console.log(HELP)
	process.exit(0)
}

const steps = stepsArg ? STEPS.filter(s => stepsArg.includes(STEP_ALIASES[s])) : undefined

const argsStr = args.join(' ')

const bump = /-b (.+?)( -|$)/.exec(argsStr)?.[1].split(' ')
const newVersion = /-v (\S+)/.exec(argsStr)?.[1]

const tIndex = args.indexOf('-t')
const tagPrefix = tIndex !== -1 ? args[tIndex + 1] : undefined

const dryRun = /\b-d\b/.test(argsStr)
const yes = /\b-y\b/.test(argsStr)

void relion({
	...(steps && { steps }),
	...(bump && { bump }),
	...(newVersion && { newVersion }),
	...(tagPrefix !== undefined && { tagPrefix }),
	dryRun,
	yes,
}).catch((err: unknown) => {
	console.error(err)
	process.exit(1)
})