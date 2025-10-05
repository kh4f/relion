import type { ChangelogSectionsSelector, DefaultChangelogSections, TypeGroupDefinition } from '@/types'
import { defaultChangelogSections } from '@/defaults'

export const changelogSectionsSelector: ChangelogSectionsSelector = {
	...defaultChangelogSections,
	pick(...keys: (keyof DefaultChangelogSections)[]) {
		return Object.fromEntries(keys.map(key => [key, this[key]]))
	},
	omit(...keys: (keyof ChangelogSectionsSelector)[]): ChangelogSectionsSelector {
		const keySet = new Set(keys)
		return Object.fromEntries(Object.entries(this).filter(([key]) => !keySet.has(key as keyof ChangelogSectionsSelector))) as ChangelogSectionsSelector
	},
	modify(key: keyof DefaultChangelogSections, modify: (section: TypeGroupDefinition) => TypeGroupDefinition) {
		return { ...this, [key]: modify(this[key]) }
	},
} as const