import { expect, test } from 'bun:test'
import { bump } from '@/steps'
import { defCfg } from '@/defaults'
import type { ResolvedCfg } from '@/types'

test.each(['package.json', 'resources.rc'])('bump version in %s', async fixture => {
	const path = `tests/fixtures/${fixture}`
	const cfg: ResolvedCfg = { ...defCfg, bump: [path], newVersion: '1.2.3', yes: true }

	const file = Bun.file(path)
	const orig = await file.text()
	await bump(cfg)
	const updated = await file.text()

	expect(updated).toMatchSnapshot()
	await Bun.write(path, orig)
})