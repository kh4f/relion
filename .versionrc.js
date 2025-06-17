export default {
	sign: true,
	preset: {
		types: [
			{ type: "feat", section: "✨ Features", hidden: false },
			{ type: "fix", section: "🩹 Bug Fixes", hidden: false },
			{ type: "perf", section: "⚡ Performance", hidden: false },
			{ type: "chore", section: "🧹 Adjustments", hidden: true },
			{ type: "refactor", section: "🧹 Adjustments", hidden: true }
		]
	},

	"_gh-release-notes": {
		infile: "RELEASE.md",
		preset: {
			header: ""
		},
		context: {
			fullChangelogLink: true,
			linkReferences: false
		},
		writerOpts: {
			headerPartial: ""
		}
	}
}
