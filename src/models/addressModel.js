/**
 * Defines the Address Model.
 * @param {Object} sequelize - The Sequelize instance.
 * @param {Object} DataTypes - The DataTypes object from Sequelize.
 * @returns {Object} The User model.
 */
module.exports = (sequelize, DataTypes) => {
	const AddressModel = sequelize.define(
		/* Model name*/
		"Addresses",

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

			street: {
				type: DataTypes.STRING,
				allowNull: false,
			},

			city: {
				type: DataTypes.STRING,
				allowNull: false,
			},

			state: {
				type: DataTypes.STRING,
				allowNull: false,
			},

			zipCode: {
				type: DataTypes.STRING,
				allowNull: false,
			},

			country: {
				type: DataTypes.STRING,
				allowNull: false,
			},

			isDefault: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
		},

		/* Model options */
		{
			tableName: "addresses",
			timestamps: true,
			paranoid: true,
		}
	);

	// Associations
	AddressModel.associate = function (models) {
		AddressModel.belongsTo(models.Users, {
			foreignKey: "userId",
		});
	};

	return AddressModel;
};
