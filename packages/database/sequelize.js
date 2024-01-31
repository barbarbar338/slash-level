const { Sequelize } = require("sequelize");
const { env } = require("./env.js");

const sequelize = new Sequelize({
	dialect: "postgres",
	host: env.DB_HOST,
	port: env.DB_PORT,
	username: env.DB_USERNAME,
	password: env.DB_PASSWORD,
	database: env.DB_DATABASE,
});

exports = { sequelize };
