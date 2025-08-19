const otpGenerator = require("otp-generator");

module.exports.generateOTP = (length = 4) => {
	return otpGenerator.generate(length, {
		lowerCaseAlphabets: false,
		upperCaseAlphabets: false,
		specialChars: false,
	});
};
