const path = require("path");
require("dotenv").config({
	path: path.join(__dirname, "../../.env"),
});

// Environment Variables Configuration
// This file contains all the environment variables used in the application.

const env = {
	// CORS Specific Environment Variables
	PORT: process.env.PORT || "8000",
	ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || "*",

	// Database Connection Environment Variables
	DB_USER_NAME: process.env.DB_USER_NAME,
	DB_USER_PASSWORD: process.env.DB_USER_PASSWORD,
	DB_NAME: process.env.DB_NAME,
	DB_HOST: process.env.DB_HOST,
	DB_PORT: process.env.DB_PORT,
	DB_DIALECT: process.env.DB_DIALECT,
	NODE_ENV: process.env.NODE_ENV || "development",

	JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
	JWT_REFRESH_SECRET_KEY: process.env.JWT_REFRESH_SECRET_KEY,
	JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
	JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,

	SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS, 10) || 12,

	NODEMAILER_USERNAME: process.env.NODEMAILER_USERNAME,
	NODEMAILER_PASSWORD: process.env.NODEMAILER_PASSWORD,

	TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
	TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
	TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER
};

module.exports = { env };
