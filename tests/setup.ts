import { vi } from 'vitest'

type RelionModule = typeof import('@/.')

vi.mock('@/.', async (): Promise<RelionModule> => {
	const actual = await vi.importActual<RelionModule>('@/.')
	return {
		...actual,
		default: params => actual.default({ ...params,
			dryRun: true,
			changelog: params.changelog === false
				? false
				: { ...(typeof params.changelog === 'object' ? params.changelog : {}), output: 'stdout' },
		}),
	}
})

if (!process.env.VITEST_VSCODE) vi.spyOn(console, 'log').mockImplementation(() => null)