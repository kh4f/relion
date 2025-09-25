import { defineConfig } from '@/.'

export default defineConfig({
	changelog: {
		output: 'stdout',
		header: '',
	},
	context: {
		commitHyperlink: false,
	},
})