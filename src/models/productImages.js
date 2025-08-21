/**
 * Defines the Product Images model.
 * @param {Object} sequelize - The Sequelize instance.
 * @param {Object} DataTypes - The DataTypes object from Sequelize.
 * @returns {Object} The Product Images model.
 */
module.exports = (sequelize, DataTypes) => {
	const ProductImagesModel = sequelize.define(
		"ProductImages",
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

			imageUrl: {
				type: DataTypes.STRING,
				allowNull: false,
			},

			isThumbnail: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
		},
		{
			tableName: "product_images",
			timestamps: true,
			paranoid: true,
		}
	);

	ProductImagesModel.associate = (models) => {
		ProductImagesModel.belongsTo(models.ProductVariants, {
			foreignKey: "variantId",
		});
	};

	return ProductImagesModel;
};
