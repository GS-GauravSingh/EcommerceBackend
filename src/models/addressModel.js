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

			firstname: {
				type: DataTypes.STRING,
				allowNull: true,
			},

			lastname: {
				type: DataTypes.STRING,
				allowNull: true,
			},

			email: {
				type: DataTypes.STRING,
				allowNull: true,
				unique: true,

				// If allowNull is ture and the user didn't provided any value then the Built-in validators will be skipped.
				validate: {
					isEmail: true,
				},
			},

			phoneNumber: {
				type: DataTypes.STRING,
				allowNull: true,
				unique: true,
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
