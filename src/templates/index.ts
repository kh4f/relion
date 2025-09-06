import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const readTemplateFile = (name: string) => readFileSync(join(import.meta.dirname, `${name}.hbs`), 'utf8')

export const releaseTemplate = readTemplateFile('release')