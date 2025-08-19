const jwt = require("jsonwebtoken");
const { env } = require("../config/environmentVariables");

module.exports.generateJWT = (payload) => {
	return jwt.sign(payload, env.JWT_SECRET_KEY, {
		expiresIn: env.JWT_EXPIRES_IN,
	});
};

module.exports.generateRefreshJWT = (payload) => {
	return jwt.sign(payload, env.JWT_REFRESH_SECRET_KEY, {
		expiresIn: env.JWT_REFRESH_EXPIRES_IN,
	});
};

module.exports.verifyJWT = (token) => {
	try {
		/**
		 * If the token is valid and not expired → it returns the decoded payload (e.g., { id: 123, iat: ..., exp: ... }).
		 * If the token is expired → jwt.verify throws an error with name: "TokenExpiredError".
		 * If the token is invalid (wrong signature, tampered, wrong secret) → it throws a different error like "JsonWebTokenError".
		 */
		return jwt.verify(token, env.JWT_SECRET_KEY);
	} catch (err) {
		console.error("jwtUtil: verifyJWT(): Error: JWT Verification Error:", err);
		return false;
	}
};

module.exports.verifyRefreshJWT = (token) => {
	try {
		/**
		 * If the token is valid and not expired → it returns the decoded payload (e.g., { id: 123, iat: ..., exp: ... }).
		 * If the token is expired → jwt.verify throws an error with name: "TokenExpiredError".
		 * If the token is invalid (wrong signature, tampered, wrong secret) → it throws a different error like "JsonWebTokenError".
		 */
		return jwt.verify(token, env.JWT_REFRESH_SECRET_KEY);
	} catch (err) {
		console.error("jwtUtil: verifyRefreshJWT(): Error: JWT Refresh Token Verification Error:", err);
		return false;
	}
};
