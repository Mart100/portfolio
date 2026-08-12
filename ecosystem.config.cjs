module.exports = {
	apps: [
		{
			name: 'portfolio',
			cwd: '/root/projects/portfolio',
			script: 'build/index.js',
			interpreter: 'node',
			env: {
				NODE_ENV: 'production',
				HOST: '127.0.0.1',
				PORT: 4020
			}
		}
	]
};
