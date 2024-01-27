import { Client } from "discord.js";

const slashLevel = new Client({
	intents: [
		"GuildIntegrations",
		"GuildMembers",
		"GuildMessages",
		"Guilds",
		"MessageContent",
		"GuildVoiceStates",
	],
});

slashLevel.login();
