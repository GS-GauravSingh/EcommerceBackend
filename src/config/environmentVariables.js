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

	SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS, 10) || 12,

	NODEMAILER_USERNAME: process.env.NODEMAILER_USERNAME,
	NODEMAILER_PASSWORD: process.env.NODEMAILER_PASSWORD
};

module.exports = { env };
