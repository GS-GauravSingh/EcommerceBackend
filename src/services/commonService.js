/**
 * This file contains common utility functions that can be used across the application.
 */

/**
 * createNewRecord(): This function is used to create a new record in the database.
 * @param {object} model - The model to be used for creating a new record.
 * @param {object} data - The data to be used for creating a new record.
 * @param {object} dbTransaction - The database transaction object.
 * @returns {object} - The record found in the database.
 */
module.exports.createNewRecord = async (model, data, dbTransaction) => {
	try {
		const record = await model.create(data, { transaction: dbTransaction });

		return record ? JSON.parse(JSON.stringify(record)) : null;
	} catch (error) {
		console.log("commonService.js: createNewRecord(): Error: ", error);
		throw error;
	}
};

/**
 * findByCondition(): This function is used to find a record in the database based on a condition.
 * @param {object} model - The model to be used for querying the database.
 * @param {Object} condition - The condition to be used for querying the database.
 * @param {object} attributes - The attributes to be returned from the database.
 * @returns {object} - The record found in the database.
 */
module.exports.findByCondition = async (model, condition, attributes) => {
	try {
		const record = await model.findOne({
			where: condition,
			...(attributes !== undefined &&
				attributes.length > 0 && {
					attributes,
				}),
		});

		return record ? JSON.parse(JSON.stringify(record)) : null;
	} catch (error) {
		console.log("commonService.js: findByCondition(): Error: ", error);
		throw error;
	}
};

/**
 * findByPrimaryKey(): This function is used to find a record in the database based on its primary key.
 * @param {object} model - The model to be used for querying the database.
 * @param {string} id - The primary key of the record to be found.
 * @param {object} attributes - The attributes to be returned from the database.
 * @returns {object} - The record found in the database.
 */
module.exports.findByPrimaryKey = async (model, id, attributes) => {
	try {
		const record = await model.findByPk(id, {
			...(attributes !== undefined &&
				attributes.length > 0 && {
					attributes,
				}),
		});

		return record ? JSON.parse(JSON.stringify(record)) : null;
	} catch (error) {
		console.log("commonService.js: findByPrimaryKey(): Error: ", error);
		throw error;
	}
};

/**
 * updateRecord(): This function is used to update an existing record in the database.
 * @param {object} model - The model to be used for querying the database.
 * @param {object} data - The data to be updated.
 * @param {object} condition - The condition to find the record(s).
 * @param {object} dbTransaction - The database transaction object.
 * @returns {object} -  The updated record(s) or null if not found.
 */
module.exports.updateRecord = async (model, data, condition, dbTransaction) => {
	try {
		const record = await model.update(data, {
			where: condition,
			transaction: dbTransaction,
			returning: true, // in an update() or bulkCreate() or destroy() operation, it tells Sequelize to return the updated (or created/deleted) records as part of the result.
		});

		return record ? JSON.parse(JSON.stringify(record)) : null;
	} catch (error) {
		console.log("commonService.js: updateRecord(): Error: ", error);
		throw error;
	}
};
