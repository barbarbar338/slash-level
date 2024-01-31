const { connect, sequelize } = require("@slash-level/database");
const { logger } = require("@slash-level/logger");
const utils = require("@slash-level/utils");
const { Client } = require("discord.js");
const { CONFIG } = require("../config/index.js");

class SlashLevel extends Client {
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
			presence: {
				activities: [
					{
						name: utils.getRandomElement(
							CONFIG.PRESENCE.activity.name,
						),
						type: utils.getRandomElement(
							CONFIG.PRESENCE.activity.type,
						),
					},
				],
				status: utils.getRandomElement(CONFIG.PRESENCE.status),
			},
		});
	}

	async handleEvents() {
		try {
			const eventFiles = this.utils.readDirRecursive("./events");

			for (const eventFile of eventFiles) {
				this.logger.info(`Loading event: ${eventFile}`);

				const event = (await import(`file:\\\\\\${eventFile}`)).default;
				console.dir(event);

				this[event.once ? "once" : "on"](
					event.name,
					async (...args) => {
						const isSuccessful = await event.execute(this, ...args);

						if (!isSuccessful)
							this.logger.error(
								`Event ${event.name} failed to execute!`,
							);
					},
				);

				this.logger.info(`Loaded event: ${eventFile}`);
			}
		} catch (err) {
			this.logger.error("Error loading events", err);
			process.exit(1);
		}
	}

	async connect() {
		this.logger.info("Connecting to database...");
		await connect();
		this.logger.info("Connected to database");

		this.logger.info("Loading events...");
		await this.handleEvents();
		this.logger.info("All events loaded!");

		this.logger.info("Connecting to Discord...");
		await this.login(CONFIG.BOT_TOKEN);
		this.logger.info("Connected, ready to rock!");
	}
}

exports = { SlashLevel };
