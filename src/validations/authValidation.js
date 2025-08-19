const Joi = require("joi");

// Reusable Schemas
const phoneSchema = Joi.string()
	.length(10)
	.pattern(/^\+91[6-9]\d{9}$/)
	.required()
	.messages({
		"string.empty": "Phone number is required",
		"string.pattern.base": "Phone number must start with +91 and be a valid 10-digit mobile number",
	});

const otpSchema = Joi.string()
	.length(4)
	.pattern(/^[0-9]{4}$/)
	.required()
	.messages({
		"string.empty": "OTP is required",
		"string.length": "OTP must be 4 digits",
		"string.pattern.base": "Invalid OTP format",
	});

const emailSchema = Joi.string().email().required().messages({
	"string.empty": "Email is required",
	"string.email": "Invalid email format",
});

module.exports = {
	login: {
		phoneNumber: phoneSchema,
	},
};
