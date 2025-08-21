/**
 * Defines the Product model.
 * @param {Object} sequelize - The Sequelize instance.
 * @param {Object} DataTypes - The DataTypes object from Sequelize.
 * @returns {Object} The Product model.
 */

const { CATEGORIES } = require("../constants");

module.exports = (sequelize, DataTypes) => {
	const ProductModel = sequelize.define(
		"Products",
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
			},

			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},

			description: {
				type: DataTypes.STRING,
				allowNull: false,
			},

			brandName: {
				type: DataTypes.STRING,
				allowNull: false,
			},

			category: {
				type: DataTypes.ENUM(Object.values(CATEGORIES)),
			},
		},
		{
			tableName: "products",
			timestamps: true,
			paranoid: true,
		}
	);

	ProductModel.associate = (models) => {
		ProductModel.hasMany(models.ProductVariants, {
			foreignKey: "productId",
			as: "variants",
		});
	};

	return ProductModel;
};
