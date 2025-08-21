/**
 * This file contains common utility functions that can be used across the application.
 */

/**
 * createNewRecord(): This function is used to create a new record in the database.
 * optionally supporting nested creation for associated models.
 * @param {object} model - The model to be used for creating a new record.
 * @param {object} data - The data to be used for creating a new record.
 * @param {object} dbTransaction - The database transaction object.
 * @param {boolean} raw - Whether to return raw sequelize instance or not.
 * @param {Array|null} [include=null] - Optional array of associated models to include for nested creation.
 *                                      Each item should contain the model and alias (`as`) if defined.
 * @returns {object} - The record found in the database.
 */
module.exports.createNewRecord = async (
	model,
	data,
	dbTransaction,
	raw = false,
	include = null
) => {
	try {

		const options = {transaction: dbTransaction};
		if(include){
			options.include = include;
		}

		const record = await model.create(data, options);
		if (raw) {
			return record ? record : null;
		}
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
 * @param {boolean} raw - Whether to return raw sequelize instance or not.
 * @returns {object} - The record found in the database.
 */
module.exports.findByCondition = async (
	model,
	condition,
	attributes,
	raw = false
) => {
	try {
		const record = await model.findOne({
			where: condition,
			...(attributes !== undefined &&
				attributes.length > 0 && {
					attributes,
				}),
		});

		if (raw) {
			return record ? record : null;
		}

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
 * @param {boolean} raw - Whether to return raw sequelize instance or not.
 * @returns {object} - The record found in the database.
 */
module.exports.findByPrimaryKey = async (
	model,
	id,
	attributes,
	raw = false
) => {
	try {
		const record = await model.findByPk(id, {
			...(attributes !== undefined &&
				attributes.length > 0 && {
					attributes,
				}),
		});

		if (raw) {
			return record ? record : null;
		}

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

/**
 * saveRecord(): This function is used to save the changed mad to a record in the database.
 * @param {object} modelInstance - The record to be saved in the database.
 * @param {object} dbTransaction - The database transaction object.
 * @param {boolean} raw - Default value false, If true, returns plain JavaScript objects instead of Sequelize instances.
 * @returns {object} - The record saved in the database.
 */
module.exports.saveRecord = async (
	modelInstance,
	dbTransaction,
	raw = false
) => {
	try {
		const record = await modelInstance.save({
			transaction: dbTransaction,
		});
		if (raw) {
			return record ? record : null;
		}
		return record ? JSON.parse(JSON.stringify(record)) : null;
	} catch (error) {
		console.log("commonService.js: saveRecord(): Error: ", error);
		throw error;
	}
};
