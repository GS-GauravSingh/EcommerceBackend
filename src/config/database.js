const fs = require("fs");
const path = require("path");
const { env } = require("./environmentVariables");
const { Sequelize, DataTypes } = require("sequelize");

// Sequelize instance creation
const sequelize = new Sequelize(
	env.DB_NAME,
	env.DB_USER_NAME,
	env.DB_USER_PASSWORD,
	{
		host: env.DB_HOST,
		dialect: env.DB_DIALECT,
		port: env.DB_PORT,
		// logging: false
	}
);

// Store all models in a `db` object.
// It contains all the models defined in the `models` directory in the form of key-value pairs. Where the "key" is the model name and the "value" is the model definition.
const db = {};
fs.readdirSync(path.join(__dirname, "../models"))
	.filter(
		(file) =>
			file.indexOf(".") !== 0 && // Ignore hidden files
			file !== path.basename(__filename) && // Ignore this file
			file.endsWith(".js") // Only include JavaScript files
	)
	.forEach((file) => {
		const model = require(path.join(__dirname, "../models", file))(
			sequelize,
			DataTypes
		);
		db[model.name] = model;
	});

// Now call `associate` method for each model (if defined)
Object.keys(db).forEach((model) => {
	if (db[model].associate) {
		db[model].associate(db);
	}
});

// Check the database connection
sequelize
	.authenticate()
	.then(() => {
		console.log("✅ Database connection established successfully.");
	})
	.catch((error) => {
		console.error("❌ Unable to connect to the database:", error);
	});

// Sync all models with the database
// Use `alter: true` to update the database schema without dropping existing tables, "force: true" will drop the tables and recreate them, "logging: true" will log the SQL queries
sequelize
	.sync({ force: true, alter: false, logging: false })
	.then(() => {
		console.log("✅ All models were synchronized successfully.");
	})
	.catch((error) => {
		console.error("❌ Error synchronizing models:", error);
	});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.DataTypes = DataTypes;

module.exports = { sequelize, db };
