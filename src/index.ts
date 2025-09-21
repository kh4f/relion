import type { UserConfig } from '@/types'

export { default } from '@/relion'
export { changelogSectionsSelector } from '@/utils'
export type * from '@/types'
export const defineConfig = (config: UserConfig): UserConfig => config