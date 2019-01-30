const sha1 = require('sha1');
const ValidationHelper = require('../helpers/ValidationHelper');
const AuthHelper = require('../helpers/AuthHelper');
const AbstractController = require('./AbstractController');
const UserService = require('../services/UserService');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

const roles = ['admin', 'user'];

class UserController extends AbstractController {

	async verifyUser(req, res) {
		try {
			ValidationHelper.validateStringField(req.params, 'id');
			ValidationHelper.validateStringField(req.params, 'token');
			let user = await UserService.getUserForId(req.params.id);
			if (user == null) {
				throw new NotFoundError('User does not exist');
			}
			if (user.verificationToken == null) {
				throw new BadRequestError('User already verified');
			}
			if (user.verificationToken != req.params.token) {
				throw new BadRequestError('Invalid verification token');
			}
			user.verificationToken = null;
			user = await UserService.saveUser(user);
			this.sendResponse(res, this._cleanUserSensitiveData(user), 200);
		} catch (error) {
			this.sendResponseError(res, error);
		}
	}

	async loginUser(req, res) {
		try {
			ValidationHelper.validateStringField(req.body, 'username');
			ValidationHelper.validateStringField(req.body, 'password');
			const user = await UserService.getUserForUsername(req.body.username);
			if (user == null) {
				throw new NotFoundError('User does not exist');
			}
			if (user.verificationToken != null) {
				throw new UnauthorizedError('User not verified');
			}
			if (user.password != this._hashPassword(req.body.password)) {
				throw new UnauthorizedError('Invalid password');
			}
			const responseBody = {
				token: AuthHelper.createToken(user.id, user.username),
			}
			this.sendResponse(res, responseBody, 201);
		} catch (error) {
			this.sendResponseError(res, error);
		}
	}

	getUsersList(req, res) {
		// TODO
	}

	async getUser(req, res) {
		try {
			let user = req.user;
			ValidationHelper.validateStringField(req.params, 'id');
			if (user.role != 'admin' && user.id != req.params.id) {
				throw new ForbiddenError('User role not allowed');
			}
			if (user.id != req.params.id) {
				user = await UserService.getUserForId(req.params.id);
				if (user == null) {
					throw new NotFoundError('User does not exist');
				}
			}
			this.sendResponse(res, this._cleanUserSensitiveData(user), 200);
		} catch (error) {
			this.sendResponseError(res, error);
		}
	}

	async createUser(req, res) {
		try {
			this._validateUserData(req.body);
			let user = await UserService.getUserForUsername(req.body.username);
			if (user != null) {
				throw new BadRequestError('Username not available');
			}
			user = req.body;
			user.password = this._hashPassword(user.password);
			user.verificationToken = sha1(Math.random().toString());
			user = await UserService.saveUser(user);
			this.sendResponse(res, this._cleanUserSensitiveData(user), 201);
		} catch (error) {
			this.sendResponseError(res, error);
		}
	}

	updateUser(req, res) {
		// TODO
	}

	deleteUser(req, res) {
		// TODO
	}

	_validateUserData(user) {
		ValidationHelper.validateStringField(user, 'username');
		ValidationHelper.validateStringField(user, 'firstName');
		ValidationHelper.validateStringField(user, 'lastName');
		ValidationHelper.validateStringField(user, 'email');
		ValidationHelper.validateStringField(user, 'password');
		ValidationHelper.validateStringField(user, 'role');
		if (!roles.includes(user.role)) {
			throw new BadRequestError('Invalid role, must be: ' + roles.join(', '));
		}
	}

	_hashPassword(password) {
		return sha1(password);
	}

	_cleanUserSensitiveData(user) {
		delete user.password;
		delete user.verificationToken;
		return user;
	}

}

module.exports = new UserController();
