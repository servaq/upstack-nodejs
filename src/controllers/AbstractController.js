class AbstractController {

	sendResponse(response, body, statusCode) {
		response.status(statusCode || 200).json(body || {});
	}

	sendResponseError(response, error, statusCode) {
		console.log(error);
		const body = {}
		if (error.statusCode) {
			body.message = error.message;
			statusCode = error.statusCode;
		} else {
			body.message = 'Internal error';
		}
		this.sendResponse(response, body, statusCode || 500);
	}

}

module.exports = AbstractController;
