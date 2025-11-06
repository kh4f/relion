import { readFileSync } from 'node:fs'
import semver from 'semver'
import type { ReleaseType, ParsedCommit, Bumper, TransformedConfig } from '@/types'
import { log, parseCommits } from '@/utils'

export const parseVersion = (bumper: Bumper): string => {
	const fileContent = readFileSync(bumper.file, 'utf8')
	const version = bumper.pattern.exec(fileContent)?.groups?.version
	if (!version) throw new Error(`Version not found in '${bumper.file}' with pattern '${bumper.pattern}'`)
	if (!semver.valid(version)) throw new Error(`Invalid version format in '${bumper.file}': '${version}'`)
	return version
}

export const extractVersionFromTag = (tag: string, tagPattern: RegExp): string | undefined => {
	return tagPattern.exec(tag)?.groups?.version
}

export const determineNextVersion = (config: TransformedConfig, currentVersion: string, commitsScope?: string): string => {
	if (config.context.newVersion) {
		if (!semver.valid(config.context.newVersion)) {
			throw new Error(`Invalid release version format: '${config.context.newVersion}'`)
		}
		return config.context.newVersion
	}
	let releaseType: ReleaseType
	if (config.releaseType) {
		releaseType = config.releaseType
	} else {
		const unreleasedCommits = parseCommits('unreleased', config.commitsParser, config.prevReleaseTagPattern, commitsScope)
		releaseType = calculateReleaseType(unreleasedCommits, currentVersion, config.zeroMajorBreakingIsMinor)
	}
	const newVersion = increaseVersion(currentVersion, releaseType)
	log(`Determined new version: '${newVersion}' (release type: '${releaseType}')`)
	return newVersion
}

const calculateReleaseType = (commits: ParsedCommit[], currentVersion?: string, zeroMajorBreakingIsMinor?: boolean): ReleaseType => {
	let releaseType: ReleaseType = 'patch'

	const hasFeature = commits.some(commit => commit.type === 'feat')
	if (hasFeature) releaseType = 'minor'

	const hasBreakingChange = commits.some(commit => commit.breakingChanges)
	if (hasBreakingChange) releaseType = 'major'

	return (releaseType === 'major' && semver.major(currentVersion ?? '1.0.0') === 0 && zeroMajorBreakingIsMinor) ? 'minor' : releaseType
}

const increaseVersion = (currentVersion: string, releaseType: ReleaseType): string =>
	semver.inc(currentVersion, releaseType) ?? (() => {
		throw new Error(`Failed to calculate new version from '${currentVersion}' with release type '${releaseType}'`)
	})()