import { readFileSync } from 'node:fs'
import semver from 'semver'
import type { ReleaseType, ParsedCommit, VersionedFile, TransformedConfig } from '@/types'
import { log, parseCommits } from '@/utils'

export const parseVersion = (versionedFile: VersionedFile): string => {
	const fileContent = readFileSync(versionedFile.filePath, 'utf8')
	const version = versionedFile.versionPattern.exec(fileContent)?.[2]
	if (!version) throw new Error(`Version not found in '${versionedFile.filePath}' with pattern '${versionedFile.versionPattern}'`)
	if (!semver.valid(version)) throw new Error(`Invalid version format in '${versionedFile.filePath}': '${version}'`)
	log(`Current version from '${versionedFile.filePath}': '${version}'`)
	return version
}

export const determineNextVersion = async (config: TransformedConfig, currentVersion: string): Promise<string> => {
	if (config.releaseVersion) {
		if (!semver.valid(config.releaseVersion)) {
			throw new Error(`Invalid release version format: '${config.releaseVersion}'`)
		}
		return config.releaseVersion
	}
	let releaseType: ReleaseType
	if (config.releaseType) {
		releaseType = config.releaseType
	} else {
		const unreleasedCommits = await parseCommits('unreleased', config.commitsParser, config.prevReleaseTagPattern)
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