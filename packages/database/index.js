import { Sequelize } from "sequelize";
import { env } from "./env.js";

export * from "./models/GuildMemberModel.js";
export * from "./models/GuildModel.js";
export * from "./models/UserModel.js";

/**
 * Connects to database
 * @returns {Promise<Sequelize>} Sequelize instance
 */
export const connect = async (options) => {
	const sequelize = new Sequelize({
		dialect: "postgres",
		host: env.DB_HOST,
		port: env.DB_PORT,
		username: env.DB_USERNAME,
		password: env.DB_PASSWORD,
		database: env.DB_DATABASE,
	});

	await sequelize.authenticate();
	await sequelize.sync({ force: true });

	return sequelize;
};
