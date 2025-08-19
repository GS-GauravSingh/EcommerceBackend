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
	"/login",
	requestValidator(authValidation.login),
	authControllers.login,
	authControllers.sendOtpPhone
);

router.post(
	"/verify-otp-phone",
	requestValidator(authValidation.verifyOtp),
	authControllers.verifyOtpPhone
);

router.post(
	"/resend-otp-phone",
	requestValidator(authValidation.login),
	authControllers.reSendOtpPhone
);

router.post(
	"/send-otp-email",
	verifyAuthToken,
	requestValidator(authValidation.verifyEmail),
	authControllers.sendOtpEmail
);

router.post(
	"/verify-otp-email",
	verifyAuthToken,
	requestValidator(authValidation.verifyOtp),
	authControllers.verifyOtpEmail
);

router.post(
	"/resend-otp-email",
	verifyAuthToken,
	requestValidator(authValidation.verifyEmail),
	authControllers.sendOtpEmail
);

router.post("/logout", verifyAuthToken, authControllers.logout);

module.exports = router;
