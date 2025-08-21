/**
 * Defines the Cart Item model.
 * @param {Object} sequelize - The Sequelize instance.
 * @param {Object} DataTypes - The DataTypes object from Sequelize.
 * @returns {Object} The Cart Item model.
 */

module.exports = (sequelize, DataTypes) => {
	const CartItemModel = sequelize.define(
		"CartItem",
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
			},

			cartId: {
				type: DataTypes.UUID,
				allowNull: false,
				references: {
					model: "cart",
					key: "id",
				},
				onDelete: "CASCADE",
			},

			productId: {
				type: DataTypes.UUID,
				allowNull: false,
				references: {
					model: "product",
					key: "id",
				},
			},

			quantity: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
		},
		{
			tableName: "cart_item",
			timestamps: true,
			paranoid: true,
		}
	);

	CartItemModel.associate = (models) => {
		CartItemModel.belongsTo(models.Cart, {
			foreignKey: "cartId",
		});

        CartItemModel.belongsTo(models.Products, {
            foreignKey: "productId"
        });
	};

	return CartItemModel;
};
