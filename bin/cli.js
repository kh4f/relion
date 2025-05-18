#!/usr/bin/env node

import ryly from '../src/index.js';
import cmdParser from '../src/commands.js';

ryly(cmdParser.argv).catch((err) => {
	console.error(err);
	process.exit(1);
});
