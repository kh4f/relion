import { vi } from 'vitest'
import * as promptModule from '@/utils'

type DefaultsModule = typeof import('@/defaults')

vi.mock('@/defaults', async (): Promise<DefaultsModule> => {
	const actual = await vi.importActual<DefaultsModule>('@/defaults')
	return {
		...actual,
		defaultChangelogOptions: { ...actual.defaultChangelogOptions, output: 'stdout' },
		defaultConfig: { ...actual.defaultConfig, dryRun: true },
	}
})

vi.spyOn(promptModule, 'promptToContinue').mockImplementation(async (message: string) => {
	console.log(message)
	return Promise.resolve()
})