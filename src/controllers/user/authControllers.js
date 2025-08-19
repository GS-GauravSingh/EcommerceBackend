const response = require("../../response");
const db = require("../../config/database").sequelize;
const { StatusCodes, getReasonPhrase } = require("http-status-codes");
const commonService = require("../../services/commonService");
const commonUtil = require("../../utils/commonUtil");
const {
	generateOtpMessageTemplate,
} = require("../../templates/phone/otpMessageTemplate");
const smsService = require("../../services/smsService");
const emailService = require("../../services/emailService");
const {
	generateJWT,
	generateRefreshJWT,
	verifyRefreshJWT,
} = require("../../utils/jwtUtil");
const { env } = require("../../config/environmentVariables");
const {
	generateOtpEmailTemplate,
} = require("../../templates/email/otpEmailTemplate");

// LOGIN/REGISTER - Primary mode of authentication is via phone number and OTP. So, no need for creating a separate login and register controller.
module.exports.login = async (req, res) => {
	const dbTransaction = await db.transaction();

	try {
		const { Users } = db.models;
		const { phoneNumber } = req.body;

		// Check: Phone Number is present or not
		if (!phoneNumber) {
			return response.errorResponse(
				req,
				res,
				{
					msgCode: "MISSING_REQUIRED_FILEDS_IN_REQUEST_BODY",
					data: "Phone number is required",
				},
				StatusCodes.BAD_REQUEST,
				dbTransaction
			);
		}

		// Check: Account already exists
		let user = await commonService.findByCondition(Users, {
			phoneNumber: phoneNumber,
		});

		if (!user) {
			// Account doesn't exists. In this case, create an account for this user.
			user = await commonService.createNewRecord(
				Users,
				{ phoneNumber: phoneNumber },
				dbTransaction
			);
		}

		req.userId = user.id; // attach the user's id to the request object for further use.
		await dbTransaction.commit(); // close the transaction
		next(); // call the next middleware
	} catch (error) {
		console.error("authControllers.js: login(): Error: ", error);
		response.errorResponse(
			req,
			res,
			{
				msgCode: "INTERNAL_SERVER_ERROR",
				data: error?.message,
			},
			StatusCodes.INTERNAL_SERVER_ERROR,
			dbTransaction
		);
	}
};

// SEND OTP - Phone Number
module.exports.sendOtpPhone = async (req, res) => {
	const dbTransaction = await db.transaction();

	try {
		const { userId } = req;
		const { Users } = db.models;

		// Generate a 4-digit OTP
		const otp = commonUtil.generateOTP(4);

		// store the generated OTP in the user record
		const [affectedRecordsCnt, affectedRecords] =
			await commonService.updateRecord(
				Users,
				{
					otp: otp,
					otpExpiredAt:
						Date.now() +
						2 *
							60 *
							1000 /* OTP will expire in 2 minutes after generation */,
				},
				{ id: userId },
				dbTransaction
			);

		// Check (Optional)
		if (affectedRecordsCnt === 0) {
			// User not found
			return response.errorResponse(
				req,
				res,
				{ msgCode: "USER_NOT_FOUND" },
				StatusCodes.BAD_REQUEST,
				dbTransaction
			);
		}

		// send the OTP to the user's phone number - twilio
		const otpMessage = generateOtpMessageTemplate(otp, 2);
		await smsService.sendSMS({
			recipientPhoneNumber: affectedRecords[1]?.phoneNumber,
			messageTemplate: otpMessage,
		});

		return response.successResponse(
			req,
			res,
			{ msgCode: "OTP_SENT_SUCCESSFULLY" },
			StatusCodes.OK,
			dbTransaction
		);
	} catch (error) {
		console.error("authControllers.js: sendOtpPhone(): Error: ", error);
		response.errorResponse(
			req,
			res,
			{
				msgCode: "INTERNAL_SERVER_ERROR",
				data: error?.message,
			},
			StatusCodes.INTERNAL_SERVER_ERROR,
			dbTransaction
		);
	}
};

// VERIFY OTP - Phone Number
module.exports.verifyOtpPhone = async (req, res) => {
	const dbTransaction = await db.transaction();

	try {
		const { Users } = db.models;
		const { phoneNumber, otp } = req.body;

		// Check
		if (!phoneNumber || !otp) {
			return response.errorResponse(
				req,
				res,
				{
					msgCode: "MISSING_REQUIRED_FILEDS_IN_REQUEST_BODY",
					data: "Phone number and OTP both are required",
				},
				StatusCodes.BAD_REQUEST,
				dbTransaction
			);
		}

		const user = await commonService.findByCondition(Users, {
			phoneNumber: phoneNumber,
		});

		// Check
		if (!user) {
			// User not found
			return response.errorResponse(
				req,
				res,
				{ msgCode: "USER_NOT_FOUND" },
				StatusCodes.BAD_REQUEST,
				dbTransaction
			);
		}

		// Check: OTP is correct or not
		if (!(await user.compareOTP(otp))) {
			return response.errorResponse(
				req,
				res,
				{ msgCode: "INCORRECT_OTP" },
				StatusCodes.BAD_REQUEST,
				dbTransaction
			);
		}

		// Check: OTP is expired or not
		if (user.isOTPExpired()) {
			return response.errorResponse(
				req,
				res,
				{ msgCode: "OTP_EXPIRED" },
				StatusCodes.BAD_REQUEST,
				dbTransaction
			);
		}

		// If we reach here, it means OTP is correct.
		// generate access and refresh token
		const accessToken = generateJWT({ id: user.id });
		const refreshToken = generateRefreshJWT({ id: user.id });

		// Update the user record.
		const [affectedRecordsCnt, affectedRecords] =
			await commonService.updateRecord(
				Users,
				{
					otp: null,
					otpExpiredAt: null,
					phoneNumberVerifiedAt: Date.now(),
					refreshToken: refreshToken,
				},
				{ phoneNumber: phoneNumber },
				dbTransaction
			);

		// Access Token
		res.cookie("accessToken", accessToken, {
			maxAge: 15 * 60 * 1000, // maxAge defines Cookie Lifespan before it expires. After 15 minutes (15 * 60 * 1000 in Milliseconds), the cookie is automatically deleted.
			httpOnly: true, // Prevents client-side JavaScript from accessing the cookie.
			sameSite: env.NODE_ENV === "development" ? "strict" : "none",
			secure: env.NODE_ENV === "development" ? false : true,
		});

		// Refresh Token
		res.cookie("refreshToken", refreshToken, {
			maxAge: 7 * 24 * 60 * 60 * 1000, // maxAge defines Cookie Lifespan before it expires. After 7 days (7 * 24 * 60 * 60 * 1000 in Milliseconds), the cookie is automatically deleted.
			httpOnly: true, // Prevents client-side JavaScript from accessing the cookie.
			sameSite: env.NODE_ENV === "development" ? "strict" : "none",
			secure: env.NODE_ENV === "development" ? false : true,
		});

		return response.successResponse(
			req,
			res,
			{
				msgCode: "OTP_VERIFIED_SUCCESSFULLY",
				data: {
					user: affectedRecords[1],
					accessToken,
					refreshToken,
				},
			},
			StatusCodes.CREATED,
			dbTransaction
		);
	} catch (error) {
		console.error("authControllers.js: verifyOtpPhone(): Error: ", error);
		response.errorResponse(
			req,
			res,
			{
				msgCode: "INTERNAL_SERVER_ERROR",
				data: error?.message,
			},
			StatusCodes.INTERNAL_SERVER_ERROR,
			dbTransaction
		);
	}
};

// RE-SEND OTP - Phone Number
module.exports.reSendOtpPhone = async (req, res) => {
	const dbTransaction = await db.transaction();

	try {
		const { phoneNumber } = req.body;
		const { Users } = db.models;

		// Generate a 4-digit OTP
		const otp = commonUtil.generateOTP(4);

		// store the generated OTP in the user record
		const [affectedRecordsCnt, affectedRecords] =
			await commonService.updateRecord(
				Users,
				{
					otp: otp,
					otpExpiredAt:
						Date.now() +
						2 *
							60 *
							1000 /* OTP will expire in 2 minutes after generation */,
				},
				{ phoneNumber: phoneNumber },
				dbTransaction
			);

		// Check (Optional)
		if (affectedRecordsCnt === 0) {
			// User not found
			return response.errorResponse(
				req,
				res,
				{ msgCode: "USER_NOT_FOUND" },
				StatusCodes.BAD_REQUEST,
				dbTransaction
			);
		}

		// send the OTP to the user's phone number - twilio
		const otpMessage = generateOtpMessageTemplate(otp, 2);
		await smsService.sendSMS({
			recipientPhoneNumber: affectedRecords[1]?.phoneNumber,
			messageTemplate: otpMessage,
		});

		return response.successResponse(
			req,
			res,
			{ msgCode: "OTP_SENT_SUCCESSFULLY" },
			StatusCodes.OK,
			dbTransaction
		);
	} catch (error) {
		console.error("authControllers.js: reSendOtpPhone(): Error: ", error);
		response.errorResponse(
			req,
			res,
			{
				msgCode: "INTERNAL_SERVER_ERROR",
				data: error?.message,
			},
			StatusCodes.INTERNAL_SERVER_ERROR,
			dbTransaction
		);
	}
};

// SEND OTP - Email Address
module.exports.sendOtpEmail = async (req, res) => {
	const dbTransaction = await db.transaction();

	try {
		const { user } = req;
		const { email } = req.body;
		const { Users } = db.models;

		if (!email) {
			return response.errorResponse(
				req,
				res,
				{
					msgCode: "MISSING_REQUIRED_FILEDS_IN_REQUEST_BODY",
					data: "Email is required",
				},
				StatusCodes.BAD_REQUEST,
				dbTransaction
			);
		}

		// Generate a 4-digit OTP
		const otp = commonUtil.generateOTP(4);

		// store the generated OTP in the user record
		await commonService.updateRecord(
			Users,
			{
				otp: otp,
				otpExpiredAt:
					Date.now() +
					2 *
						60 *
						1000 /* OTP will expire in 2 minutes after generation */,
			},
			{ id: user.id },
			dbTransaction
		);

		// send the OTP to the user's phone number - twilio
		const otpEmailMessage = generateOtpEmailTemplate(otp, 2);
		await emailService.sendMail({
			recipientEmail: email,
			subject: "OTP for verification",
			textMessage: `Your OTP of verification is: ${otp}. Do not share this with anyone.`,
			htmlTemplate: otpEmailMessage,
		});

		return response.successResponse(
			req,
			res,
			{ msgCode: "OTP_SENT_SUCCESSFULLY" },
			StatusCodes.OK,
			dbTransaction
		);
	} catch (error) {
		console.error("authControllers.js: sendOtpEmail(): Error: ", error);
		response.errorResponse(
			req,
			res,
			{
				msgCode: "INTERNAL_SERVER_ERROR",
				data: error?.message,
			},
			StatusCodes.INTERNAL_SERVER_ERROR,
			dbTransaction
		);
	}
};

// VERIFY OTP - Email Address
module.exports.verifyOtpEmail = async (req, res) => {
	const dbTransaction = await db.transaction();

	try {
		const { id } = req.user;
		const { otp } = req.body;
		const { Users } = db.models;

		if (!otp) {
			return response.errorResponse(
				req,
				res,
				{
					msgCode: "MISSING_REQUIRED_FILEDS_IN_REQUEST_BODY",
					data: "OTP is required",
				},
				StatusCodes.BAD_REQUEST,
				dbTransaction
			);
		}

		const user = await commonService.findByPrimaryKey(Users, id);

		// Check: OTP is correct or not
		if (!(await user.compareOTP(otp))) {
			return response.errorResponse(
				req,
				res,
				{ msgCode: "INCORRECT_OTP" },
				StatusCodes.BAD_REQUEST,
				dbTransaction
			);
		}

		// Check: OTP is expired or not
		if (user.isOTPExpired()) {
			return response.errorResponse(
				req,
				res,
				{ msgCode: "OTP_EXPIRED" },
				StatusCodes.BAD_REQUEST,
				dbTransaction
			);
		}

		// Update the user record
		await commonService.updateRecord(
			Users,
			{
				otp: null,
				otpExpiredAt: null,
				emailVerifiedAt: Date.now(),
			},
			{ id: user.id },
			dbTransaction
		);

		return response.successResponse(
			req,
			res,
			{ msgCode: "EMAIL_VERIFIED_SUCCESSFULLY" },
			StatusCodes.OK,
			dbTransaction
		);
	} catch (error) {
		console.error("authControllers.js: verifyOtpEmail(): Error: ", error);
		response.errorResponse(
			req,
			res,
			{
				msgCode: "INTERNAL_SERVER_ERROR",
				data: error?.message,
			},
			StatusCodes.INTERNAL_SERVER_ERROR,
			dbTransaction
		);
	}
};

// LOGOUT
module.exports.logout = async (req, res) => {
	const dbTransaction = await db.transaction();

	try {
		const { Users } = db.models;
		const incommingRefreshToken =
			req.cookies.refreshToken || req.body.refreshToken;

		// 1. If refresh token is not sent, then just clear the cookie
		if (!incommingRefreshToken) {
			res.clearCookie("accessToken");
			res.clearCookie("refreshToken");

			return response.successResponse(
				req,
				res,
				{ msgCode: "LOGGED_OUT_SUCCESSFULLY" },
				StatusCodes.OK,
				dbTransaction
			);
		}

		// 2. If refresh token is sent, verify the token
		const decoded = verifyRefreshJWT(incommingRefreshToken);
		if (!decoded) {
			console.log("authControllers.js: logout(): Invalid refresh token");
			return response.errorResponse(
				req,
				res,
				{
					msgCode: "UNAUTHORIZED",
					data: "Either the refresh token is invalid or expired",
				},
				StatusCodes.UNAUTHORIZED,
				dbTransaction
			);
		}

		// 3. Remove the refresh token for the DB (invalidate it)
		const [affectedRecordsCnt, affectedRecords] =
			await commonService.updateRecord(
				Users,
				{
					refreshToken: null,
				},
				{ id: decoded.id },
				dbTransaction
			);

		if (affectedRecordsCnt === 0) {
			console.log(
				"authControllers.js: logout(): Invalid refresh token - User not found"
			);
			return response.errorResponse(
				req,
				res,
				{ msgCode: "USER_BELONGS_TO_THIS_TOKEN_DOES_NOT_EXISTS" },
				StatusCodes.UNAUTHORIZED,
				dbTransaction
			);
		}

		// 4. Clear the cookie and send the response
		res.clearCookie("accessToken");
		res.clearCookie("refreshToken");

		return response.successResponse(
			req,
			res,
			{ msgCode: "LOGGED_OUT_SUCCESSFULLY" },
			StatusCodes.OK,
			dbTransaction
		);
	} catch (error) {
		console.error("authControllers.js: logout(): Error: ", error);
		response.errorResponse(
			req,
			res,
			{
				msgCode: "INTERNAL_SERVER_ERROR",
				data: error?.message,
			},
			StatusCodes.INTERNAL_SERVER_ERROR,
			dbTransaction
		);
	}
};

// REFRESH ACCESS TOKEN
module.exports.refreshAccessToken = async (req, res) => {
	const dbTransaction = await db.transaction();

	try {
		const { Users } = db.models;
		const incommingRefreshToken =
			req.cookies.refreshToken || req.body.refreshToken;

		// 1: Refresh Token is present or not
		if (!incommingRefreshToken) {
			return response.errorResponse(
				req,
				res,
				{ msgCode: "UNAUTHORIZED" },
				StatusCodes.UNAUTHORIZED,
				dbTransaction
			);
		}

		// 2: Verify refresh token
		const decoded = verifyRefreshJWT(incommingRefreshToken);
		if (!decoded) {
			console.log(
				"authControllers.js: refreshAccessToken(): Invalid refresh token"
			);
			return response.errorResponse(
				req,
				res,
				{
					msgCode: "SESSION_EXPIRED",
					data: "Either the refresh token is invalid or expired",
				},
				StatusCodes.UNAUTHORIZED,
				dbTransaction
			);
		}

		// 3. Find User
		const user = await commonService.findByPrimaryKey(Users, decoded.id);
		if (!user) {
			console.log(
				"authControllers.js: refreshAccessToken(): Invalid refresh token - User not found"
			);
			return response.errorResponse(
				req,
				res,
				{ msgCode: "USER_BELONGS_TO_THIS_TOKEN_DOES_NOT_EXISTS" },
				StatusCodes.UNAUTHORIZED,
				dbTransaction
			);
		}

		// 4. Compare stored refresh token with incomming refresh token
		if (incommingRefreshToken !== user.refreshToken) {
			console.log(
				"authControllers.js: refreshAccessToken(): Invalid refresh token - Incomming refresh token != stored refresh token"
			);
			return response.errorResponse(
				req,
				res,
				{ msgCode: "UNAUTHORIZED" },
				StatusCodes.UNAUTHORIZED,
				dbTransaction
			);
		}

		// 5. Generate New Access Token
		const newAccessToken = generateJWT({ id: user.id });
		res.cookie("accessToken", newAccessToken, {
			maxAge: 15 * 60 * 1000, // maxAge defines Cookie Lifespan before it expires. After 15 minutes (15 * 60 * 1000 in Milliseconds), the cookie is automatically deleted.
			httpOnly: true, // Prevents client-side JavaScript from accessing the cookie.
			sameSite: env.NODE_ENV === "development" ? "strict" : "none",
			secure: env.NODE_ENV === "development" ? false : true,
		});

		return response.successResponse(
			req,
			res,
			{
				msgCode: "ACCESS_TOKEN_REFRESHED_SUCCESSFULLY",
				data: {
					user,
					accessToken: newAccessToken,
				},
			},
			StatusCodes.OK,
			dbTransaction
		);
	} catch (error) {
		console.error(
			"authControllers.js: refreshAccessToken(): Error: ",
			error
		);
		response.errorResponse(
			req,
			res,
			{
				msgCode: "INTERNAL_SERVER_ERROR",
				data: error?.message,
			},
			StatusCodes.INTERNAL_SERVER_ERROR,
			dbTransaction
		);
	}
};
