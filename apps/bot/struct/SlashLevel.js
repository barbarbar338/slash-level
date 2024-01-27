import { connect, sequelize } from "@slash-level/database";
import { logger } from "@slash-level/logger";
import * as utils from "@slash-level/utils";
import { Client } from "discord.js";
import { CONFIG } from "../config/index.js";

export class SlashLevel extends Client {
	config = CONFIG;
	utils = utils;
	logger = logger;
	sequelize = sequelize;

	constructor() {
		super({
			intents: [
				"GuildIntegrations",
				"GuildMembers",
				"GuildMessages",
				"Guilds",
				"MessageContent",
				"GuildVoiceStates",
			],
		});
	}

	async connect() {
		this.logger.info("Connecting to database...");
		await connect();
		this.logger.info("Connected to database");

		this.logger.info("Connecting to Discord...");
		await this.login(CONFIG.BOT_TOKEN);
		this.logger.info("Connected, ready to rock!");
	}
}
