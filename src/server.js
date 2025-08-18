const { sequelize } = require("./config/database"); // this will trigger the database connection logic.
const express = require("express");
const cors = require("cors");
const hpp = require("hpp");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const { env } = require("./config/environmentVariables");
const errorHandler = require("./middlewares/errorHandlingMiddlewares");
const http = require("http");

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

// Server Creation - Based on Node Environment
let httpServer;
if (env.NODE_ENV === "production") {
	httpServer = http.createServer(app);
	httpServer.listen(env.PORT, () => {
		console.log(
			`✅✅✅✅  Production Server is running on port ${env.PORT} ✅✅✅✅`
		);
	});
} else {
	httpServer = http.createServer(app);
	httpServer.listen(env.PORT, () => {
		console.log(
			`✅✅✅✅  Development Server is running on port ${env.PORT} ✅✅✅✅`
		);
	});
}

// App Routes
app.get("/", (req, res) => {
	return res.status(200).json({
		message: "Welcome to the Ecommerce Backend API",
	});
});
app.use("/api", require("./routes"));

// Error Middlewares
app.use(errorHandler.routeNotFound);
app.use(errorHandler.globalErrorHandler);

/**
 * process - represents the running instance of node.js project
 * process.on() - .on() is used to register (attach) an event listener to the process object
 * "unhandledRejection" - is a special event name in Node.js that’s triggered when a Promise is rejected but no .catch() handler is attached to handle the error.
 */
process.on("unhandledRejection", (err) => {
	console.error("Possibly Unhandled Rejection Happened: ", err.message);
});

/**
 * This is a graceful shutdown handler for a Node.js application.
 * It ensures that:
 * 	- All database/network connections are closed properly.
 *  - The HTTP server is stopped cleanly.
 * 	- The Node.js process exits safely when termination signals are received (like pressing Ctrl+C or killing the process).
 */

/**
 * SIGTERM: Signal sent to terminate the process programmatically. It is not triggered by the user manually.
 * SIGINT: Signal sent when you press Ctrl+C in the terminal.
 */
const closeHandler = () => {
	sequelize
		.close()
		.then(() => console.info("🔌 Database connection closed successfully."))
		.catch((err) =>
			console.error("❌ Error closing Database connection:", err)
		)
		.finally(() => {
			httpServer.close(() => {
				console.info("🛑 Server stopped successfully.");
				process.exit(0);
			});
		});
};
process.on("SIGTERM", closeHandler);
process.on("SIGINT", closeHandler);
