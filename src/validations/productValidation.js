const Joi = require("joi");
const { CATEGORIES } = require("../constants");

module.exports.registerProduct = Joi.object({
	name: Joi.string().required(),
	description: Joi.string().required(),
	brandName: Joi.string().required(),
	category: Joi.string()
		.valid(...Object.values(CATEGORIES))
		.required(),
	variants: Joi.array()
		.items(
			Joi.object({
				color: Joi.string().required(),
				sizes: Joi.array()
					.items(
						Joi.object({
							size: Joi.number().required(),
							stock: Joi.number().integer().required(),
							originalPrice: Joi.number().positive().required(),
							discount: Joi.number().required(),
							finalPrice: Joi.number().positive().required(),
						})
					)
					.min(1)
					.required(),
				images: Joi.array()
					.items(
						Joi.object({
							imageUrl: Joi.string().uri().required(),
							isThumbnail: Joi.boolean().required(),
						})
					)
					.min(1)
					.required(),
			})
		)
		.min(1)
		.required(),
});
