import { Sequelize } from "sequelize";
import { env } from "./env";

export * from "./models/GuildMemberModel";
export * from "./models/GuildModel";
export * from "./models/UserModel";

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
