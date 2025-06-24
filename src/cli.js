#!/usr/bin/env node

import relion from './index.js'
import cmdParser from './commands.js'

relion(cmdParser.argv)