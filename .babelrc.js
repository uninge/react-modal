module.exports = {
	plugins: [
		['@babel/plugin-proposal-class-properties', { loose: true }],
	],
	presets: [
		'@babel/preset-react',
		[
			'@babel/preset-env',
			{
				useBuiltIns: "entry",
				corejs: {
					version: 3,
					proposals: true,
				},
			}
		]
	],
};
