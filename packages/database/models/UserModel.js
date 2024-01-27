import { DataTypes, Model } from "sequelize";
import { sequelize } from "../sequelize.js";

export class UserModel extends Model {}

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
