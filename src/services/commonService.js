/**
 * This file contains common utility functions that can be used across the application.
 */

/**
 * findByPrimaryKey(): This function is used to find a record in the database based on its primary key.
 * @param {object} model - The model to be used for querying the database.
 * @param {number} id - The primary key of the record to be found.
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
