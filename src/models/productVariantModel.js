/**
 * Defines the Product Variant model.
 * @param {Object} sequelize - The Sequelize instance.
 * @param {Object} DataTypes - The DataTypes object from Sequelize.
 * @returns {Object} The Product Variant model.
 */

module.exports = (sequelize, DataTypes) => {
	const ProductVariantModel = sequelize.define(
		"ProductVariants",
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
			},

			productId: {
				type: DataTypes.UUID,
				allowNull: false,
				references: {
					model: "products",
					key: "id",
				},
				onDelete: "CASCADE",
			},

			color: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			tableName: "product_variants",
			timestamps: true,
			paranoid: true,
		}
	);

	ProductVariantModel.associate = (models) => {
		ProductVariantModel.belongsTo(models.Products, {
			foreignKey: "productId",
		});

		ProductVariantModel.hasMany(models.ProductSizes, {
			foreignKey: "variantId",
			as: "sizes",
		});

		ProductVariantModel.hasMany(models.ProductImages, {
			foreignKey: "variantId",
			as: "images",
		});
	};

	return ProductVariantModel;
};
