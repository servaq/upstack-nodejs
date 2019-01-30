class ForbiddenError extends Error {

	constructor(message) {
		super(message);
	}

}

module.exports = ForbiddenError;