const BadRequestError = require('../errors/BadRequestError');

class ValidationHelper {

	validateStringField(object, fieldName) {
		if (!object[fieldName] || new String(object[fieldName]).trim().length == 0) {
			throw new BadRequestError(`Invalid ${fieldName}`);
		}
	}

}

module.exports = new ValidationHelper();