const { StatusCodes } = require("http-status-codes");
const response = require("../response");

function checkRoleAccess(roles) {
	return (req, res, next) => {
		const { user } = req; // get the logged-in user details
		if (!roles.includes(user?.role)) {
			return response.errorResponse(
				req,
				res,
				{
					msgCode: "UNAUTHORIZED",
                    data: "Access Denied"
				},
				StatusCodes.FORBIDDEN
			);
		}

		next();
	};
}

module.exports = checkRoleAccess;
