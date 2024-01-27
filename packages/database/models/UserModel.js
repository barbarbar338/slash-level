import { DataTypes, Model } from "sequelize";

export class UserModel extends Model {}

UserModel.init({
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
});
