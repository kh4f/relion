import type { UserConfig } from '@commitlint/types'
import { RuleConfigSeverity } from '@commitlint/types'

const Configuration: UserConfig = {
	rules: {
		'body-leading-blank': [RuleConfigSeverity.Error, 'always'],
		'footer-leading-blank': [RuleConfigSeverity.Error, 'always'],
		'header-max-length': [RuleConfigSeverity.Error, 'always', 100],
		'header-trim': [RuleConfigSeverity.Error, 'always'],
		'subject-empty': [RuleConfigSeverity.Error, 'never'],
		'type-empty': [RuleConfigSeverity.Error, 'never'],
		'scope-empty': [RuleConfigSeverity.Error, 'never'],
		'type-enum': [RuleConfigSeverity.Error, 'always', [
			'build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf',
			'refactor', 'revert', 'style', 'test', 'release',
		]],
	},
	prompt: {
		questions: {
			type: {
				description: 'Select the type of change',
				enum: {
					feat: { description: 'New feature' },
					fix: { description: 'Bug fix' },
					docs: { description: 'Documentation change' },
					style: { description: 'Code style change' },
					refactor: { description: 'Code improvement not fixing bug or adding feature' },
					perf: { description: 'Performance improvement' },
					test: { description: 'Test change' },
					build: { description: 'Build system change' },
					ci: { description: 'CI change' },
					chore: { description: 'Maintenance change' },
					revert: { description: 'Commit revert' },
					release: { description: 'Package release (e.g. release(relion): v1.0.0)' },
				},
			},
			scope: { description: 'Specify the scope of the change (e.g. component name)' },
			subject: { description: 'Write a short, imperative tense description of the change' },
			body: { description: 'Write a longer description of the change' },
			isBreaking: { description: 'Is this a breaking change?' },
			breaking: { description: 'Describe the breaking change' },
			isIssueAffected: { description: 'Does this change affect any issues?' },
			issues: { description: 'Add issue references (e.g. fixes #1, refs #2)' },
		},
	},
}

export default Configuration