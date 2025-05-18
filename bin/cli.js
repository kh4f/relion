#!/usr/bin/env node

import ryly from '../index.js';
import cmdParser from '../command.js';

ryly(cmdParser.argv).catch((err) => {
	console.error(err);
	process.exit(1);
});
