const { app } = require("./app");
const http = require("http");
const { env } = require("./constants/environmentVariables");

// Create HTTP server
const server = http.createServer(app);

// PORT on which the server will run
const PORT = env.PORT;

// Start the server and listen for incomming requests
server.listen(PORT, () => {
	console.log(`✅✅✅✅  Server is running on port ${PORT} ✅✅✅✅`);
});
