import { type UserConfig } from '@/types'

export const testConfig: UserConfig = {
	silent: true,
	profile: 'test',
	_test: {
		changelog: {
			output: 'stdout',
		},
	},
}