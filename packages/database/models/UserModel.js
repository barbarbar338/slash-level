const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../sequelize.js");

class UserModel extends Model {}

UserModel.init(
	{
		userID: {
			type: DataTypes.STRING,
			primaryKey: true,
			allowNull: false,
			unique: true,
		},
		rankCardColor: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "ffffff",
		},
	},
	{ sequelize, modelName: "UserModel" },
);

exports = { UserModel };
