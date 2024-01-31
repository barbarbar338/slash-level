const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../sequelize.js");

class GuildModel extends Model {}

GuildModel.init(
	{
		guildID: {
			type: DataTypes.STRING,
			primaryKey: true,
			allowNull: false,
			unique: true,
		},
		levelingDisabledChannels: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			allowNull: true,
			defaultValue: [],
		},
		levelingDisabledRoles: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			allowNull: true,
			defaultValue: [],
		},
		levelUpMessageChannel: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		levelUpMessage: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		levelUpRewards: {
			type: DataTypes.ARRAY(DataTypes.JSON), // { roleIDs: string[]; level: number; }
			allowNull: true,
			defaultValue: [],
		},
	},
	{ sequelize, modelName: "GuildModel" },
);

exports = { GuildModel };
