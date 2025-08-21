/**
 * Defines the Product Sizes model.
 * @param {Object} sequelize - The Sequelize instance.
 * @param {Object} DataTypes - The DataTypes object from Sequelize.
 * @returns {Object} The Product Sizes model.
 */
module.exports = (sequelize, DataTypes) => {
	const ProductSizeModel = sequelize.define(
		"ProductSizes",
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
			},

			variantId: {
				type: DataTypes.UUID,
				references: {
					model: "product_variants",
					key: "id",
				},
				onDelete: "CASCADE",
			},

			size: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},

			originalPrice: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},

			discount: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},

			finalPrice: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},

			stock: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
		},
		{
			tableName: "product_sizes",
			timestamps: true,
			paranoid: true,
		}
	);

	ProductSizeModel.associate = (models) => {
		ProductSizeModel.belongsTo(models.ProductVariants, {
			foreignKey: "variantId",
		});
	};

	return ProductSizeModel;
};
