const AuthHelper = require('./AuthHelper');
const DatabaseHelper = require('./DatabaseHelper');
const UnauthorizedError = require('../errors/UnauthorizedError');
const UserService = require('../services/UserService');

class AppHelper {

	async closeResources(req, res, next) {
		res.on('finish', async () => {
			await DatabaseHelper.disconnect();
		});
		next();
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

	checkAdminRole(req, res, next) {
		try {
			if (!req.user || !req.user.role || req.user.role != 'admin') {
				throw new UnauthorizedError('User role not authorized');
			}
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

module.exports = new AppHelper();