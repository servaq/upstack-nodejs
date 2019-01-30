const configs = {
	dev: {
		token: {
			secret: 'acmVcg5Rcrsp4fukNjhAsKE9',
			ttlSeconds: 30000,
		},
		database: {
			client: 'mysql',
			connection: {
				host: 'localhost',
				user: 'root',
				password: 'root',
				database: 'upstack-node',
				charset: 'utf8',
			}
		}
	}
}

module.exports.getConfig = (env) => {
	env = env && env || (process.env.NODE_ENV && process.env.NODE_ENV || 'dev');
	return configs[env];
}
