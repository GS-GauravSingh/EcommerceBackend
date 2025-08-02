const express = require("express");
const cors = require("cors");
const hpp = require("hpp");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const { env } = require("./constants/environmentVariables");

// Express `app` initialization
const app = express();

// Setting up Middlewares
app.use(
	cors({
		origin: env.ALLOWED_ORIGINS,
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
		credentials: true, // Allow cookies to be sent
	})
);
app.use(express.urlencoded({ limit: "10mb", extended: true })); // Used to parse URL-encoded data like form data and make them available in `req.body`
app.use(express.json({ limit: "10mb" })); // Used to parse JSON data and make them available in `req.body`
app.use(hpp()); // Prevent HTTP Parameter Pollution attacks
app.use(helmet()); // Set various HTTP headers for security
app.use(morgan("dev")); // Log HTTP requests in development mode
app.use(cookieParser()); // Parse cookies and make them available in `req.cookies`

// App Routes
app.get("/", (req, res) => {
	return res.status(200).json({
		message: "Welcome to the Ecommerce Backend API",
	});
});

module.exports = { app };
