#!/usr/bin/env node

import relion from '../src/index.js'
import cmdParser from '../src/commands.js'

relion(cmdParser.argv).catch((err) => {
	console.error(err)
	process.exit(1)
})