const router = require("express").Router();
const { ROLE } = require("../../../constants");
const authControllers = require("../../../controllers/user/authControllers");
const productControllers = require("../../../controllers/user/productControllers");
const checkRoleAccess = require("../../../middlewares/authorizeMiddlewares");
const {
	requestValidator,
} = require("../../../middlewares/requestValidatorMiddleware");
const {
	verifyAuthToken,
} = require("../../../middlewares/verifyAuthTokenMiddleware");
const authValidation = require("../../../validations/authValidation");
const productValidation = require("../../../validations/productValidation");

/* ================== Authentication Routes ================== */
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

/* ================== Product Management Routes ================== */
router.post(
	"/products",
	requestValidator(productValidation.registerProduct),
	productControllers.registerProduct
);

module.exports = router;
