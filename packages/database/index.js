import { Sequelize } from "sequelize";

import { GuildMemberModel } from "./models/GuildMemberModel.js";
import { GuildModel } from "./models/GuildModel.js";
import { UserModel } from "./models/UserModel.js";
import { sequelize } from "./sequelize.js";

/**
 * Connects to database
 * @returns {Promise<Sequelize>} Sequelize instance
 */
async function connect() {
	await sequelize.authenticate();
	await sequelize.sync({ force: true });

	return sequelize;
}

export { GuildMemberModel, GuildModel, UserModel, connect, sequelize };
