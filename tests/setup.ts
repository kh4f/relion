import { vi } from 'vitest'

type DefaultsModule = typeof import('@/defaults')

vi.mock('@/defaults', async (): Promise<DefaultsModule> => {
	const actual = await vi.importActual<DefaultsModule>('@/defaults')
	return {
		...actual,
		defaultChangelogOptions: { ...actual.defaultChangelogOptions, output: 'stdout' },
		defaultConfig: { ...actual.defaultConfig, dryRun: true },
	}
})