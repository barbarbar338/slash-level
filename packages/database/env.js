const { config } = require("dotenv");
const { cleanEnv, num, str } = require("envalid");

config();

const env = cleanEnv(process.env, {
	DB_HOST: str({
		default: "localhost",
		desc: "Postgres database host",
	}),
	DB_PORT: num({
		default: 5432,
		desc: "Postgres database port",
	}),
	DB_USERNAME: str({
		default: "postgres",
		desc: "Postgres database username",
	}),
	DB_PASSWORD: str({
		desc: "Postgres database password",
		default: "postgres",
	}),
	DB_DATABASE: str({
		default: "slash-level",
		desc: "Postgres database name",
	}),
});

exports = { env };
