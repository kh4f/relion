#!/usr/bin/env node

import relion from './index.js'
import cmdParser from './commands.js'

relion(cmdParser.argv).catch((err) => {
	console.error(err)
	process.exit(1)
})