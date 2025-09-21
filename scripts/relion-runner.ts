import { register } from 'node:module'

register('@/utils/hbs-helper.ts', import.meta.url)
await (await import('@/cli')).runCli()