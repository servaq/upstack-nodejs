const configs = {
	dev: {
		token: {
			secret: 'acmVcg5Rcrsp4fukNjhAsKE9',
			ttlSeconds: 30000,
		},
		database: {
			client: 'mysql',
			connection: {
				host: 'database',
				user: 'root',
				password: 'root',
				database: 'upstack-node',
				charset: 'utf8',
			}
		}
	},
	test: {
		token: {
			secret: 'MuNrGr2QNf4XBjk8LG8X6fBB',
			ttlSeconds: 30000,
		},
		database: {
			client: 'mysql',
			connection: {
				host: 'database',
				user: 'root',
				password: 'root',
				database: 'upstack-node-test',
				charset: 'utf8',
			}
		}
	}
}

module.exports.getConfig = (env) => {
	env = env && env || (process.env.NODE_ENV && process.env.NODE_ENV || 'dev');
	return configs[env];
}
