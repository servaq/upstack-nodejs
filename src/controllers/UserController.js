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

	async getUsersList(req, res) {
		try {
			const usersList = await UserService.getAllUsers(true);
			usersList.forEach(user => user = this._cleanUserSensitiveData(user));
			this.sendResponse(res, usersList, 200);
		} catch (error) {
			this.sendResponseError(res, error);
		}
	}

	async getUser(req, res) {
		try {
			const user = await this._getParamUserAndValidateAuthorization(req);
			this.sendResponse(res, this._cleanUserSensitiveData(user), 200);
		} catch (error) {
			this.sendResponseError(res, error);
		}
	}

	async createUser(req, res) {
		try {
			this._validateUserData(req.body);
			await this._validateUsernameAvailability(req.body.username);
			let user = req.body;
			user.password = this._hashPassword(user.password);
			user.verificationToken = sha1(Math.random().toString());
			user = await UserService.saveUser(user);
			this.sendResponse(res, this._cleanUserSensitiveData(user), 201);
		} catch (error) {
			this.sendResponseError(res, error);
		}
	}

	async updateUser(req, res) {
		try {
			let user = await this._getParamUserAndValidateAuthorization(req);
			const changePassword = req.body.password && true || false;
			this._validateUserData(req.body, changePassword);
			if (user.role != req.body.role && user.role == 'user' && req.user.role != 'admin') {
				throw new ForbiddenError('User role not allowed');
			}
			if (user.username != req.body.username) {
				await this._validateUsernameAvailability(req.body.username);
				user.username = req.body.username;
			}
			user.firstName = req.body.firstName;
			user.lastName = req.body.lastName;
			user.email = req.body.email;
			user.role = req.body.role;
			if (changePassword) {
				user.password = this._hashPassword(req.body.password);
			}
			user = await UserService.saveUser(user);
			this.sendResponse(res, this._cleanUserSensitiveData(user), 200);
		} catch (error) {
			this.sendResponseError(res, error);
		}
	}

	deleteUser(req, res) {
		// TODO
	}

	async _validateUsernameAvailability(username) {
		const user = await UserService.getUserForUsername(username);
		if (user != null) {
			throw new BadRequestError('Username not available');
		}
	}

	async _getParamUserAndValidateAuthorization(req) {
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
		if (user.verificationToken != null) {
			throw new ForbiddenError('User not verified');
		}
		return user;
	}

	_validateUserData(user, validatePassword = true) {
		ValidationHelper.validateStringField(user, 'username');
		ValidationHelper.validateStringField(user, 'firstName');
		ValidationHelper.validateStringField(user, 'lastName');
		ValidationHelper.validateStringField(user, 'email');
		ValidationHelper.validateStringField(user, 'role');
		if (!roles.includes(user.role)) {
			throw new BadRequestError('Invalid role, must be: ' + roles.join(', '));
		}
		if (validatePassword) {
			ValidationHelper.validateStringField(user, 'password');
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
