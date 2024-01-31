const { config } = require("dotenv");
const { cleanEnv, str } = require("envalid");

config();

const env = cleanEnv(process.env, {
	BOT_TOKEN: str({
		desc: "Discord bot token",
	}),
});

module.exports = { env };
