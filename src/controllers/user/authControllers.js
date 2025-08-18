const response = require("../../response");
const db = require("../../config/database").sequelize;
const { StatusCodes, getReasonPhrase } = require("http-status-codes");

// LOGIN/REGISTER - Primary mode of authentication is via phone number and OTP. So, no need for creating a separate login and register controller.
module.exports.login = async (req, res) => {
    
};

// SEND OTP - Phone Number
module.exports.sendOtpPhone = async (req, res) => {};

// VERIFY OTP - Phone Number
module.exports.verifyOtpPhone = async (req, res) => {};

// RE-SEND OTP - Phone Number
module.exports.reSendOtpPhone = async (req, res) => {};

// SEND OTP - Email Address
module.exports.sendOtpEmail = async (req, res) => {};

// VERIFY OTP - Email Address
module.exports.verifyOtpEmail = async (req, res) => {};

// RE-SEND OTP - Email Address
module.exports.reSendOtpEmail = async (req, res) => {};

// LOGOUT
module.exports.logout = async (req, res) => {};
