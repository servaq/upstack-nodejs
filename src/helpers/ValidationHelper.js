const UserService = require('../services/UserService');
const AuthHelper = require('../helpers/AuthHelper');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');

class ValidationHelper {

	validateStringField(object, fieldName) {
		if (!object[fieldName] || new String(object[fieldName]).trim().length == 0) {
			throw new BadRequestError(`Invalid ${fieldName}`);
		}
	}

}

module.exports = new ValidationHelper();