const commonService = require("../services/commonService");
const response = require("../response");
const { StatusCodes } = require("http-status-codes");
const { verifyJWT } = require("../utils/jwtUtil");
const db = require("../config/database").sequelize;

const verifyAuthToken = async (req, res, next) => {
	try {
		const { Users } = db.models;
		let token;

		if (req.cookies.accessToken) {
			token = req.cookies.accessToken;
		} else if (
			req.headers.authorization &&
			req.headers.authorization.startsWith("Bearer")
		) {
			token = req.headers.authorization.split(" ")[1];
		}

		if (!token) {
			console.log(
				"verifyAuthTokenMiddleware.js: verifyAuthToken(): Error: No token provided"
			);
			return response.errorResponse(
				req,
				res,
				{ msgCode: "UNAUTHORIZED" },
				StatusCodes.UNAUTHORIZED
			);
		}

		const decoded = verifyJWT(token);
		if (!decoded) {
			console.log(
				"verifyAuthTokenMiddleware.js: verifyAuthToken(): Error: Invalid token"
			);
			return response.errorResponse(
				req,
				res,
				{ msgCode: "UNAUTHORIZED" },
				StatusCodes.UNAUTHORIZED
			);
		}

		let user = await commonService.findByPrimaryKey(
			Users,
			decoded.id,
			[],
			true
		);
		if (!user) {
			console.log(
				"verifyAuthTokenMiddleware.js: verifyAuthToken(): Error: User not found"
			);
			return response.error(
				req,
				res,
				{ msgCode: "UNAUTHORIZED" },
				StatusCodes.UNAUTHORIZED
			);
		}

		req.user = user; // attach the user to the request object for further use.
		next(); // calls the next middleware
	} catch (error) {
		console.log("verifyAuthTokenMiddleware.js: verifyAuthToken(): Error: ");
		return response.errorResponse(
			req,
			res,
			{ msgCode: "UNAUTHORIZED", data: error?.message },
			StatusCodes.UNAUTHORIZED
		);
	}
};

module.exports = { verifyAuthToken };
