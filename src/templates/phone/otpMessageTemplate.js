/**
 * OTP Message Template
 * @param {string} otp - The OTP code
 * @param {number} expiryMinutes - Expiry time in minutes
 * @returns {string} - Formatted OTP SMS
 */
const generateOtpMessageTemplate = (otp, expiryMinutes = 2) => {
	return `Your verification code is ${otp}. It will expire in ${expiryMinutes} minutes. Do not share this code with anyone.`;
};

module.exports = { generateOtpMessageTemplate };
