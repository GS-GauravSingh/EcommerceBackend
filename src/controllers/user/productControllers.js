const response = require("../../response");
const db = require("../../config/database").sequelize;
const { StatusCodes, getReasonPhrase } = require("http-status-codes");
const commonService = require("../../services/commonService");

// REGISTER PRODUCT - Used to register/create a new product in our database
module.exports.registerProduct = async (req, res) => {
	const dbTransaction = await db.transaction();

	try {
		const { Products, ProductVariants, ProductSizes, ProductImages } =
			db.models;

		const newProduct = await commonService.createNewRecord(
			Products,
			req.body,
			dbTransaction,
			false,
			[
				{
					model: ProductVariants,
					as: "variants",
					include: [
						{
							model: ProductSizes,
							as: "sizes",
						},
						{
							model: ProductImages,
							as: "images",
						},
					],
				},
			]
		);

		console.log(newProduct);

		return response.successResponse(
			req,
			res,
			{ msgCode: "PRODUCT_CREATED_SUCCESSFULLY", data: newProduct },
			StatusCodes.CREATED,
			dbTransaction
		);
	} catch (error) {
		console.error(
			"productControllers.js: registerProduct(): Error: ",
			error
		);
		response.errorResponse(
			req,
			res,
			{
				msgCode: "INTERNAL_SERVER_ERROR",
				data: error?.message,
			},
			StatusCodes.INTERNAL_SERVER_ERROR,
			dbTransaction
		);
	}
};
