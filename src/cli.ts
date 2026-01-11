import relion from './index.js'
import type { Step } from '@/types'

const HELP = `Usage: relion [options]

Options:
  -b            Run bump step
  -f            Run context step
  -c            Run commit step
  -t            Run tag step
  -v <version>  Specify new version
  -d            Dry run
`

const args = process.argv.slice(2).join(' ')

if (!args) {
	console.log(HELP)
	process.exit(0)
}

const newVersion = /-v (\S+)/.exec(args)?.[1]
const dryRun = /-\w*d/.test(args)

relion({
	flow: [
		/-\w*b/.test(args) && 'bump',
		/-\w*f/.test(args) && 'context',
		/-\w*c/.test(args) && 'commit',
		/-\w*t/.test(args) && 'tag',
	].filter(Boolean) as Step[],
	...(newVersion && { newVersion }),
	...(dryRun && { dryRun }),
})