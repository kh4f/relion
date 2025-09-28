import { register } from 'node:module'

register('@/utils/hbs-load-hook.ts', import.meta.url)
await (await import('@/cli')).runCli()