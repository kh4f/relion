import type { UserConfig } from '@/types'

export { default } from '@/relion'
export { sectionsSelector, mergeConfigs } from '@/utils'
export type * from '@/types'
export const defineConfig = (config: UserConfig): UserConfig => config