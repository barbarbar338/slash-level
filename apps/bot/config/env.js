import { config } from "dotenv";
import { cleanEnv, str } from "envalid";

config();

export const env = cleanEnv(process.env, {
	BOT_TOKEN: str({
		desc: "Discord bot token",
	}),
});
