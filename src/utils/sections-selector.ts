import type { DefaultChangelogSections, ChangelogSectionsSelector } from '@/types'
import { defaultChangelogSections } from '@/defaults'

export const changelogSectionsSelector: ChangelogSectionsSelector = {
	...defaultChangelogSections,
	pick(...keys: (keyof DefaultChangelogSections)[]) {
		return Object.fromEntries(keys.map(key => [key, this[key]]))
	},
	omit(...keys: (keyof DefaultChangelogSections)[]) {
		const keySet = new Set(keys)
		return Object.fromEntries(Object.entries(this).filter(([key]) => !keySet.has(key as keyof DefaultChangelogSections)))
	},
} as const