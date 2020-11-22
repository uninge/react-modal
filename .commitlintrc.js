module.exports = {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'type-enum': [
			2,
			'always',
			[
				'feature',
				'refactor',
				'chore',
				'style',
				'docs',
				'perf',
				'fix',
				'build',
				'revert',
				'ci',
				'test',
			],
		],
	},
};
