const { StatusCodes, getReasonPhrase } = require("http-status-codes");
const response = require("../response");

// Error response middleware for handling 404 - Not Found errors.
// 404 Not Found: when the route path doesn't match anything.
module.exports.routeNotFound = (req, res) => {
	console.warn(`⚠️  [404] Route Not Found: ${req.method} ${req.originalUrl}`);
	return response.errorResponse(
		req,
		res,
		{ msgCode: "ROUTE_NOT_FOUND" },
		StatusCodes.NOT_FOUND
	);
};

// Error response middleware for handling Method Not Allowed
// 405 Method Not Allowed: when the route path matches, but the HTTP method (GET/POST/PUT/etc.) does not.
module.exports.methodNotAllowed = (req, res) => {
	console.warn(
		`⛔ [405] Method Not Allowed: ${req.method} on ${req.originalUrl}`
	);
	return response.errorResponse(
		req,
		res,
		{ msgCode: "METHOD_NOT_ALLOWED" },
		StatusCodes.METHOD_NOT_ALLOWED
	);
};

// Generic error response middleware for validation and other internal server error.
module.exports.globalErrorHandler = (err, req, res, next) => {
	console.error("💥 [ERROR]", {
		method: req.method,
		url: req.originalUrl,
		name: err.name,
		message: err.message,
		stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
	});

	let error = {
		statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
		msgCode: "INTERNAL_SERVER_ERROR",
	};

	/**
	 * The error object (err) contains a name or other identifying properties (like isJoi - represents Joi Schema validation error etc.) that tell us what type of error occurred.
	 */

	/**
	 * 1. Joi Validation Error
	 * -------------------------
	 * Identified using `err.isJoi === true`
	 */
	if (err.isJoi) {
		error.statusCode = StatusCodes.BAD_REQUEST;
		error.msgCode = "VALIDATION_ERROR";
		error.message = err.details?.map((e) => ({
			message: e.message,
			param: e.path?.join("."),
		}));
	} 

	/**
	 * 2. Axios-like error (external API failure)
	 * -------------------------
	 * Common when using axios and catching errors with `err.response.data`
	 */
	else if (!err.status && err.response?.data?.error) {
		console.error("🌐 External API Error:", err.response.data.error);
		error.message = err.response.data.error
	} 

	/**
	 * 3. Custom error with status code below 500
	 * -------------------------
	 * Handles application-level errors
	 */
	else if (err.status && err.status < 500) {
		error.statusCode = err.status;
		error.message = err.message;

		if (err.errors) error.errors = err.errors;
		if (err.actionCode) error.actionCode = err.actionCode;
	} 

	return response.errorResponse(
		req,
		res,
		{ msgCode: error.msgCode, data: error },
		error.statusCode
	);
};
