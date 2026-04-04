import type { ResolvedCfg, Bumper } from '@/types'

export const defCfg: ResolvedCfg = {
	bump: ['package.json'],
	newVersion: '',
	tagPrefix: 'v',
	commitsExclude: [/^ci|build|test\(/, /^chore\(deps\)(?!!)/],
	dryRun: false,
	yes: false,
}

export const defBumpers: Bumper[] = [
	{
		filePattern: /\.rc$/,
		bump: (content, version) => content
			.replace(/(\b(FileVersion|ProductVersion)\b.*?)\d[\w.+-]*/g, `$1${version}`)
			.replace(/(\b(FILEVERSION|PRODUCTVERSION)\b.*?)\d[\w,+-]*/g, `$1${
				(/^\d+\.\d+\.\d+/.exec(version)?.[0] ?? '').replace(/\./g, ',') + ',0'
			}`),
	},
	{
		filePattern: /.*/,
		bump: (content, version) => content.replace(/(\bversion\b.*?)\d[\w.+-]*/, `$1${version}`),
	},
]