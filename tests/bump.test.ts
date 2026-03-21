import { expect, test } from 'bun:test'
import { bump } from '@/steps'
import type { ResolvedCfg } from '@/types'

const cfg: ResolvedCfg = {
	bump: ['tests/fixtures/package.json'],
	newVersion: '1.2.3',
	tagPrefix: 'v',
	dryRun: false,
	yes: true,
}

test('bump version in package.json', async () => {
	const file = Bun.file('tests/fixtures/package.json')
	const orig = await file.text()
	await bump(cfg)
	const updated = await file.text()
	expect(updated).toContain('"version": "1.2.3"')
	await Bun.write('tests/fixtures/package.json', orig)
})