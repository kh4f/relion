import path from 'path';
import { findUpSync } from 'find-up';
import { readFileSync } from 'fs';

const CONFIGURATION_FILES = [
	'', '.json', '.js', '.cjs', '.mjs', '.ts']
	.map(ext => `.versionrc${ext}`);


export async function getConfiguration() {
	let config = {};
	const configPath = findUpSync(CONFIGURATION_FILES);
	if (!configPath) {
		return config;
	}
	const ext = path.extname(configPath);
	const regex = /^\.([cm]?js|ts)$/;
	if (regex.test(ext)) {
		} else {
			config = jsConfiguration;
		}
	} else {
		config = JSON.parse(readFileSync(configPath));
	}

	/**
	 * @todo we could eventually have deeper validation of the configuration (using `ajv`) and
	 * provide a more helpful error.
	 */
	if (typeof config !== 'object') {
		throw Error(
			`[commit-and-tag-version] Invalid configuration in ${configPath} provided. Expected an object but found ${typeof config}.`,
		);
	}

	return config;
}
