import { DataTypes, Model } from "sequelize";

export class GuildMemberModel extends Model {}

GuildMemberModel.init({
	userID: {
		type: DataTypes.STRING,
		primaryKey: true,
		allowNull: false,
	},
	guildID: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	level: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: 0,
	},
	xp: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: 0,
	},
});
