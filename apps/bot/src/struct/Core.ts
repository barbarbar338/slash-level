import { Logger } from "@hammerhq/logger";
import { ActivityType, Client, Collection, REST, Routes } from "discord.js";
import { readdirSync } from "fs";
import { MongoMemoryServer } from "mongodb-memory-server";
import { connect } from "mongoose";
import { resolve } from "path";
import { CONFIG } from "../config";
import { Utils } from "./Utils";

const utils = new Utils();

export class Core extends Client {
	public config = CONFIG;
	public commands = new Collection<string, SlashLevel.ICommand>();
	public logger = new Logger("[Core]:");
	public rest = new REST({ version: "10" }).setToken(CONFIG.TOKEN);
	public utils = utils;
	public voiceUsers: Map<string, number> = new Map();

	constructor() {
		super({
			presence: {
				activities: [
					{
						name: utils.random(CONFIG.PRESENCE.activity.name),
						type: utils.random(
							CONFIG.PRESENCE.activity.type,
						) as ActivityType.Playing, // IDK why discord.js doesn't accepts this bu we can trick it this way
					},
				],
				status: utils.random(CONFIG.PRESENCE.status),
			},
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

	private async commandHandler(): Promise<void> {
		const files = readdirSync(resolve(__dirname, "..", "commands"));
		const cmdList = [];
		for (const file of files) {
			const command = (
				await import(resolve(__dirname, "..", "commands", file))
			).default as SlashLevel.ICommand;

			this.commands.set(command.builder.name, command);
			cmdList.push(command.builder.toJSON());
			this.logger.success(`Command loaded: ${command.builder.name}`);
		}

		this.logger.info("Posting commands to Discord API");
		await this.rest.put(Routes.applicationCommands(this.config.CLIENT_ID), {
			body: cmdList,
		});
		this.logger.success(`Commands successfully posted`);
	}

	private async eventHandler() {
		const files = readdirSync(resolve(__dirname, "..", "events"));
		for (const file of files) {
			const event = (
				await import(resolve(__dirname, "..", "events", file))
			).default as SlashLevel.IEvent;
			this.on(event.name, (...args: unknown[]) =>
				event.execute(this, ...args),
			);
			this.logger.success(`Event loaded: ${event.name}`);
		}
	}

	public async connect(): Promise<string> {
		this.logger.info("Loading files...");

		await this.eventHandler();
		await this.commandHandler();

		this.logger.info("Connecting to MongoDB");

		if (CONFIG.IS_DEV) {
			this.logger.warning(
				"Creating a MongoDB mock server for development",
			);
			const mongod = await MongoMemoryServer.create();
			CONFIG.MONGODB_URI = mongod.getUri();
			this.logger.success(
				"MongoDB mock server created and MONGODB_URI variable changed!",
			);
		}

		await connect(CONFIG.MONGODB_URI);

		this.logger.info("Connecting to Discord API");

		return await this.login(CONFIG.TOKEN);
	}
}
