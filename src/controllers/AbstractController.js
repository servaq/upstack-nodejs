const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ForbiddenError = require('../errors/ForbiddenError');

class AbstractController {

	constructor() {
		this.errorsMap = new Map();
		this.errorsMap.set(BadRequestError, 400);
		this.errorsMap.set(UnauthorizedError, 401);
		this.errorsMap.set(ForbiddenError, 403);
	}

	sendResponse(response, body, statusCode) {
		response.status(statusCode || 200).json(body || {});
	}

	sendResponseError(response, error, statusCode) {
		console.log(error);
		const body = {}
		if (this.errorsMap.has(error.constructor)) {
			body.message = error.message;
			statusCode = this.errorsMap.get(error.constructor);
		} else {
			body.message = 'Internal error';
		}
		this.sendResponse(response, body, statusCode || 500);
	}

}

module.exports = AbstractController;
