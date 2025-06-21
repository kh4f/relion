import fs from 'fs'
import path from 'path'

const dirpath = import.meta.dirname

function read(name) {
	return fs.readFileSync(path.join(dirpath, `${name}.hbs`), 'utf-8')
}

export const main = read('main')
export const header = read('header')
export const commit = read('commit')
export const footer = read('footer')