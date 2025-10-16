import { readFileSync } from 'node:fs'
import semver from 'semver'
import type { ReleaseType, ParsedCommit, Bumper, TransformedConfig } from '@/types'
import { log, parseCommits } from '@/utils'

export const parseVersion = (versionedFile: Bumper): string => {
	const fileContent = readFileSync(versionedFile.file, 'utf8')
	const version = versionedFile.pattern.exec(fileContent)?.[2]
	if (!version) throw new Error(`Version not found in '${versionedFile.file}' with pattern '${versionedFile.pattern}'`)
	if (!semver.valid(version)) throw new Error(`Invalid version format in '${versionedFile.file}': '${version}'`)
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
		releaseType = calculateReleaseType(unreleasedCommits)
		if (config.zeroMajorBreakingIsMinor && semver.major(currentVersion) === 0 && releaseType === 'major') releaseType = 'minor'
	}
	const newVersion = increaseVersion(currentVersion, releaseType)
	log(`Determined new version: '${newVersion}' (release type: '${releaseType}')`)
	return newVersion
}

const calculateReleaseType = (commits: ParsedCommit[]): ReleaseType => {
	const hasBreakingChange = commits.some(commit => commit.breakingChanges)
	if (hasBreakingChange) return 'major'

	const hasFeature = commits.some(commit => commit.type === 'feat')
	if (hasFeature) return 'minor'

	return 'patch'
}

const increaseVersion = (currentVersion: string, releaseType: ReleaseType): string =>
	semver.inc(currentVersion, releaseType) ?? (() => {
		throw new Error(`Failed to calculate new version from '${currentVersion}' with release type '${releaseType}'`)
	})()