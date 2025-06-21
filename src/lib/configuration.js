import path from 'path'
import { findUpSync } from 'find-up'
import { readFileSync } from 'fs'
import { pathToFileURL } from 'url'

const CONFIGURATION_FILES = [
	'', '.json', '.js', '.cjs', '.mjs', '.ts']
	.map(ext => `.versionrc${ext}`)

export async function getConfiguration() {
	let config = {}
	const configPath = findUpSync(CONFIGURATION_FILES)
	if (!configPath) return config

	const ext = path.extname(configPath)
	const regex = /^\.([cm]?js|ts)$/
	if (regex.test(ext)) {
		const exportedConfig = (await import(pathToFileURL(configPath).href)).default
		if (typeof exportedConfig === 'function') {
			config = exportedConfig()
		}
		else {
			config = exportedConfig
		}
	}
	else {
		config = JSON.parse(readFileSync(configPath))
	}

	if (typeof config !== 'object') {
		throw Error(`[relion] Invalid configuration in ${configPath} provided. Expected an object but found ${typeof config}.`)
	}

	return config
}