import { config } from "dotenv";
import { cleanEnv, num, str } from "envalid";

config();

export const env = cleanEnv(process.env, {
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
