#!/usr/bin/env node
import { relion } from './relion'
import type { Step } from './types'

const STEPS: Step[] = ['context', 'bump', 'commit', 'tag']
const STEP_ALIASES: Record<Step, string> = { context: 'c', bump: 'b', commit: 'm', tag: 't' }

const HELP = `Usage: relion [steps] [options]

Steps (e.g. 'bm' = bump + commit; omit to run all):
  c  Generate release context
  b  Bump version in files
  m  Create commit
  t  Create tag

Options (with defaults):
  -v <version>  Release version [calculated from commits]
  -b <files>    Files to bump the version in [package.json]
  -t <prefix>   Tag prefix [v]
  -d            Dry run [false]
  -y            Skip prompts [false]

Examples:
  bunx relion bm -v 1.2.3           Bump and commit with custom version
  bunx relion ct -t relion@         Generate context and create tag with custom prefix
  bunx relion -b src/manifest.json  Bump version in custom file
  bunx relion -d           			Dry run of all steps
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