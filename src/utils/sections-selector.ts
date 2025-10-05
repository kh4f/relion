import type { SectionsSelector, DefaultChangelogSections, TypeGroupDefinition } from '@/types'
import { defaultChangelogSections } from '@/defaults'

export const sectionsSelector: SectionsSelector = {
	...defaultChangelogSections,
	pick(...keys: (keyof DefaultChangelogSections)[]) {
		return Object.fromEntries(keys.map(key => [key, this[key]]))
	},
	omit(...keys: (keyof SectionsSelector)[]): SectionsSelector {
		const keySet = new Set(keys)
		return Object.fromEntries(Object.entries(this).filter(([key]) => !keySet.has(key as keyof SectionsSelector))) as SectionsSelector
	},
	modify(key: keyof DefaultChangelogSections, modify: (section: TypeGroupDefinition) => TypeGroupDefinition) {
		return { ...this, [key]: modify(this[key]) }
	},
} as const