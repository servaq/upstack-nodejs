const AuthHelper = require('../helpers/AuthHelper');
const DatabaseHelper = require('./DatabaseHelper');
const UnauthorizedError = require('../errors/UnauthorizedError');
const UserService = require('../services/UserService');

class AppConfigHelper {

	closeResources() {
		const fn = (req, res, next) => {
			next();
			res.on('finish', async () => {
				await DatabaseHelper.disconnect();
			});
		}
		return fn;
	}

	async checkAuth(req, res, next) {
		try {
			const authHeader = req.headers.Authorization && req.headers.Authorization || req.headers.authorization;
			if (!authHeader) {
				throw new UnauthorizedError('Missing authorization token');
			}
			const tokenData = AuthHelper.getTokenData(authHeader);
			if (tokenData == null) {
				throw new UnauthorizedError('Invalid authorization token');
			}
			const user = await UserService.getUserForId(tokenData.user.id);
			if (user == null) {
				throw new UnauthorizedError('User does not exist');
			}
			req.user = user;
			next();
		} catch (error) {
			console.log(error);
			const body = {
				message: error.message
			}
			res.status(401).json(body);
		}
	}

}

module.exports = new AppConfigHelper();