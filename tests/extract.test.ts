import { readFileSync } from 'node:fs'
// import { describe, expect, it } from 'vitest'

// describe('111', () => {
// 	it('22d21', () => {
// 		console.log(1)
// 		const changelogContent = readFileSync('CHANGELOG.md', 'utf-8')
// 		const latestReleasePattern = /(?<header>##.*?)\n\n(?<body>.*?)\n(?<footer>####.*?)\n/s
// 		const parts = (latestReleasePattern.exec(changelogContent))?.groups
// 		console.log(parts)
// 	})
// })

console.log(/a(.+?)b/.exec('ab123b'))

const changelogContent = readFileSync('CHANGELOG.md', 'utf-8')
const latestReleasePattern = /(?<header>##.*?)\n\n(?<body>.*?)\n\n(?<footer>####.*?)\n/s
const parts = latestReleasePattern.exec(changelogContent)?.groups
const body = parts?.body ?? ''
console.log(parts)

const bodyWithoutLinks = body.replace(/\[`?([^\]]+?)`?\]\(.+?\)/g, '$1')
console.log(bodyWithoutLinks)