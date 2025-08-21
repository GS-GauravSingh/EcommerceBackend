const fs = require("fs");
const path = require("path");
const httpStatusCodes = require("http-status-codes");
const { json } = require("sequelize");

// Object to hold language-specific messages.
// The keys are language codes (like 'en' for English), and Values are objects containing messages in that language.
const lngObj = {};

// Read all JSON files in the 'lng' directory and populate the lngObj.
// Each file should contain key-value pairs for messages in that specific language.
// The filename (without extension) is used as the key in lngObj.
// For example, 'en.json' will populate lngObj['en'] with the messages defined in that file.
fs.readdirSync(path.join(__dirname, "lng"))
	.filter(
		(file) =>
			file.indexOf(".") !== 0 && // Ignore hidden files
			file !== path.basename(__filename) && // Ignore this file
			file.endsWith(".json") // Only include JSON files
	)
	.forEach((file) => {
		const filePath = path.join(__dirname, "lng", file);
		const fileName = file.split(".")[0]; // Extract the language code from the filename
		lngObj[fileName] = require(filePath);
	});

/**
 * Function to send a success response.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Object} result - Object containing two properties: "msgCode" and "data".
 *                        - "msgCode" is the key for the message in the lngObj,
 *                        - "data" is the payload to be sent in the response.
 * @param {Number} statusCode - The HTTP status code to be sent in the response.Defaults to 200 (OK) if not provided.
 * @param {Object} dbTransaction - Database Transaction object
 *
 */
module.exports.successResponse = async (req, res, result, statusCode, dbTransaction) => {
	const lng = req.headers["accept-language"] || "en"; // Get the user's preferred language from the request headers, defaulting to 'en' (English) if not specified.

	const responseObj = {
		status: "success",
		statusCode: statusCode || 200,
		result: {
			message:
				(lngObj[lng]
					? lngObj[lng][result.msgCode]
					: lngObj["en"][result.msgCode]) ||
				httpStatusCodes.getReasonPhrase(statusCode || 200),
			data: result.data ? result.data : "",
		},
		time: Date.now(),
	};

	if(dbTransaction){
		await dbTransaction.commit();
	}

	return res.status(statusCode || 200).json(responseObj);
};

/**
 * Function to send a error response.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Object} error - Object containing two properties: "msgCode" and "error".
 *                        - "msgCode" is the key for the message in the lngObj,
 *                        - "error" is the error object or message to be sent in the response.
 * @param {Number} statusCode - The HTTP status code to be sent in the response. Defaults to 500 (Internal Server Error) if not provided.
 * @param {Object} dbTransaction - Database Transaction object
 */
module.exports.errorResponse = async (req, res, error, statusCode, dbTransaction) => {
	const lng = req.headers["accept-language"] || "en"; // Get the user's preferred language from the request headers, defaulting to 'en' (English) if not specified.

	const responseObj = {
		status: "error",
		statusCode: statusCode || 500,
		result: {
			message:
				(lngObj[lng]
					? lngObj[lng][error.msgCode]
					: lngObj["en"][error.msgCode]) ||
				httpStatusCodes.getReasonPhrase(statusCode || 500),
			data: error.data ? error.data : "",
		},
		time: Date.now(),
	};

	if(dbTransaction){
		await dbTransaction.rollback();
	}

	return res.status(statusCode || 500).json(responseObj);
};
