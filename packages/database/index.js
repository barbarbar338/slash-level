const { Sequelize } = require("sequelize");

const { GuildMemberModel } = require("./models/GuildMemberModel.js");
const { GuildModel } = require("./models/GuildModel.js");
const { UserModel } = require("./models/UserModel.js");
const { sequelize } = require("./sequelize.js");

/**
 * Connects to database
 * @returns {Promise<Sequelize>} Sequelize instance
 */
async function connect() {
	await sequelize.authenticate();
	await sequelize.sync({ force: true });

	return sequelize;
}

exports = { GuildMemberModel, GuildModel, UserModel, connect, sequelize };
