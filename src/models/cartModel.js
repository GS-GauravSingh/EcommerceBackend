/**
 * Defines the Cart model.
 * @param {Object} sequelize - The Sequelize instance.
 * @param {Object} DataTypes - The DataTypes object from Sequelize.
 * @returns {Object} The Cart model.
 */
module.exports = (sequelize, DataTypes) => {
	const CartModel = sequelize.define(
		/* Model name*/
		"Cart",

		/* Define the model attributes here */
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
			},

			userId: {
				type: DataTypes.UUID,
				allowNull: false,
				references: {
					model: "users", // refers to the User model
					key: "id", // refers to the 'id' field of that model i.e., refers to the "id" field of "Users" model.
				},
				onDelete: "CASCADE", // If user is deleted, delete all their addresses
			},

			totalItems: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},

			totalPrice: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
		},

		/* Model options */
		{
			tableName: "cart",
			timestamps: true,
			paranoid: true,
		}
	);

	/**
	 * Associations for the Cart model.
	 */
	CartModel.associate = (models) => {
		CartModel.belongsTo(models.Users, {
			foreignKey: "userId",
		});

        CartModel.hasMany(models.CartItem, {
            foreignKey: "cartId"
        });
	};

	return CartModel;
};
