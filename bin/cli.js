#!/usr/bin/env node

import standardVersion from "../src/index.js";
import cmdParser from "./command.js";

standardVersion(cmdParser.argv).catch((err) => {
	console.error(err);
	process.exit(1);
});
