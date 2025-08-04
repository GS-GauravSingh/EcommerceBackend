const bcryptjs = require("bcryptjs");
const { ROLE } = require("../constants");
const { env } = require("../config/environmentVariables");

/**
 * Defines the User model.
 * @param {Object} sequelize - The Sequelize instance.
 * @param {Object} DataTypes - The DataTypes object from Sequelize.
 * @returns {Object} The User model.
 */
module.exports = (sequelize, DataTypes) => {
	const UserModel = sequelize.define(
		/* Model name*/
		"Users",

		/* Define the model attributes here */
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
			},

			firstname: {
				type: DataTypes.STRING,
				allowNull: false,
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
				allowNull: false,
				unique: true,
			},

			isPhoneNumberVerified: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},

			isEmailVerified: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},

			role: {
				type: DataTypes.ENUM(Object.values(ROLE)),
				defaultValue: ROLE.USER, // Default role is USER
			},

			phoneOtp: {
				type: DataTypes.STRING,
				allowNull: true,
			},

			emailOtp: {
				type: DataTypes.STRING,
				allowNull: true,
			},

			phoneOtpExpiryTime: {
				type: DataTypes.DATE,
				allowNull: true,
			},

			emailOtpExpiryTime: {
				type: DataTypes.DATE,
				allowNull: true,
			},
		},

		/* Model options */
		{
			tableName: "users",
			timestamps: true,
			paranoid: true,
		}
	);

	// Custom Hooks
	// `beforeUpdate` hook is called when you update an existing record.
	// Only triggers if .save() or .update() is called on an existing record
	UserModel.addHook("beforeUpdate", async (user, options) => {
		if (user.phoneOtp && user.changed("phoneOtp")) {
			const hashedPhoneOtp = await bcryptjs.hash(
				user.phoneOtp,
				env.SALT_ROUNDS
			);
			user.phoneOtp = hashedPhoneOtp;
		}

		if (user.emailOtp && user.changed("emailOtp")) {
			const hashedEmailOtp = await bcryptjs.hash(
				user.emailOtp,
				env.SALT_ROUNDS
			);
			user.emailOtp = hashedEmailOtp;
		}
	});

	// Custom Instance Methods
	/**
	 * Instance method to compare the otp provided by the user during the registration phase.
	 * @param {String} enteredOTP - User entered OTP
	 * @param {String} phoneOrEmailStoredOtp - Phone or Email stored OTP
	 * @returns {Boolean} - returns true OTP is correct, Otherwise returns false.
	 */
	UserModel.prototype.compareOTP = async function (
		enteredOTP,
		phoneOrEmailStoredOtp
	) {
		return await bcryptjs.compare(enteredOTP, phoneOrEmailStoredOtp);
	};

	/**
	 * Instance method to check whether OTP is expired or not.
	 * @param {DATE} phoneOrEmailStoredOtpExpiryTime - Date object represent the email or phone OTP expiry time.
	 * @returns {Boolean} - returns true if expires, Otherwise return false.
	 */
	UserModel.prototype.isOTPExpired = function (
		phoneOrEmailStoredOtpExpiryTime
	) {
		if (phoneOrEmailStoredOtpExpiryTime.getTime() < Date.now()) {
			// OTP is expired.
			return true;
		}

		return false;
	};

	// Associations
	// Defining a custom method "associate" - used to establish relationship between user model and other models.
	UserModel.associate = function (models) {
		// One user can have multiple addresses - one-to-many relationship between "user" and "address" table.
		UserModel.hasMany(models.Addresses, {
			foreignKey: "userId",
		});
	};

	return UserModel;
};
