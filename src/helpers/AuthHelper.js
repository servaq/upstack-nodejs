const jwt = require('jsonwebtoken');
const config = require('../config');

const PREFIX = 'Bearer ';

class AuthHelper {

	_getConfig() {
		return config.getConfig().token;
	}

	createToken(userId, username) {
		const tokenPayload = {
			exp: Math.floor((Date.now() / 1000) + this._getConfig().ttlSeconds),
			user: {
				id: userId,
				username: username,
			},
		}
		return jwt.sign(tokenPayload, this._getConfig().secret);
	}

	getTokenData(token) {
		if (token.startsWith(PREFIX)) {
			token = token.substring(7);
		}
		try {
			return jwt.verify(token, this._getConfig().secret);
		} catch (error) {
			return null;
		}
	}

}

module.exports = new AuthHelper();