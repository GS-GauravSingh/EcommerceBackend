const router = require("express").Router();
const authControllers = require("../../../controllers/user/authControllers");
const {
	requestValidator,
} = require("../../../middlewares/requestValidatorMiddleware");
const {
	verifyAuthToken,
} = require("../../../middlewares/verifyAuthTokenMiddleware");
const authValidation = require("../../../validations/authValidation");

/* ================== Authentication ================== */
router.post(
	"/auth/login",
	requestValidator(authValidation.login),
	authControllers.login,
	authControllers.sendOtpPhone
);

router.post(
	"/auth/verify-otp-phone",
	requestValidator(authValidation.verifyOtp),
	authControllers.verifyOtpPhone
);

router.post(
	"/auth/resend-otp-phone",
	requestValidator(authValidation.login),
	authControllers.reSendOtpPhone
);

router.post(
	"/auth/send-otp-email",
	verifyAuthToken,
	requestValidator(authValidation.verifyEmail),
	authControllers.sendOtpEmail
);

router.post(
	"/auth/verify-otp-email",
	verifyAuthToken,
	requestValidator(authValidation.verifyOtpEmail),
	authControllers.verifyOtpEmail
);

router.post(
	"/auth/resend-otp-email",
	verifyAuthToken,
	requestValidator(authValidation.verifyEmail),
	authControllers.sendOtpEmail
);

router.post("/auth/logout", verifyAuthToken, authControllers.logout);
router.post("/auth/refresh-access-token", authControllers.refreshAccessToken);

module.exports = router;
