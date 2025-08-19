const router = require("express").Router();
const authControllers = require("../../../controllers/user/authControllers");
const { requestValidator } = require("../../../middlewares/requestValidatorMiddleware");
const authValidation = require("../../../validations/authValidation");


/* ================== Authentication ================== */
router.post("/login", requestValidator(authValidation.login), authControllers.login);
// router.post("/send-otp-phone", requestValidator(authValidation.login), authControllers.sendOtpPhone);
// router.post("/verify-otp-phone", requestValidator(authValidation.verifyOtpPhone), authControllers.verifyOtpPhone);
// router.post("/resend-otp-phone", requestValidator(authValidation.login), authControllers.reSendOtpPhone);
// router.post("/send-otp-email", requestValidator(authValidation.sendOtpEmail), authControllers.sendOtpEmail);
// router.post("/verify-otp-email", requestValidator(authValidation.verifyOtpEmail), authControllers.verifyOtpEmail);
// router.post("/resend-otp-email", requestValidator(authValidation.sendOtpEmail), authControllers.reSendOtpEmail);
// router.post("/logout", authControllers.logout);

module.exports = router;
