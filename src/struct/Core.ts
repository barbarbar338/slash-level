import {
	Client,
	APIMessage,
	MessageOptions,
	MessageAdditions,
	TextChannel,
	Collection,
} from "discord.js";
import { CONFIG } from "../config";
import { readdirSync } from "fs";
import { ICommand, IEvent, SlashResponse } from "my-module";
import { resolve } from "path";
import * as pogger from "pogger";
import { connect } from "mongoose";
import { makeAPIRequest } from "../utils/makeAPIRequest";

export class Core extends Client {
	public config = CONFIG;
	public commands = new Collection<string, ICommand>();

	constructor() {
		super({
			presence: {
				activity: {
					name: random(CONFIG.PRESENCE.activity.name),
					type: random(CONFIG.PRESENCE.activity.type),
				},
				status: random(CONFIG.PRESENCE.status),
				afk: CONFIG.PRESENCE.afk,
				shardID: CONFIG.PRESENCE.shardID,
			},
		});
	}

	private async createAPIMessage(
		interaction: SlashResponse,
		content: string | APIMessage,
		options: MessageAdditions | MessageOptions = {},
	): Promise<APIMessage> {
		if (!(content instanceof APIMessage))
			content = APIMessage.create(
				this.channels.resolve(interaction.channel_id) as TextChannel,
				content,
				options,
			);
		const data = content.resolveData();
		return data;
	}

	public async send(
		interaction: SlashResponse,
		content: string | APIMessage,
		options?: MessageAdditions | MessageOptions,
	): Promise<unknown> {
		const { data } = await this.createAPIMessage(
			interaction,
			content,
			options,
		);
		const body = {
			type: 4,
			data,
		};
		const res = await makeAPIRequest(
			`/interactions/${interaction.id}/${interaction.token}/callback`,
			"POST",
			body,
		);
		return res;
	}

	private async commandHandler(): Promise<void> {
		const files = readdirSync(resolve(__dirname, "..", "commands"));
		for (const file of files) {
			const command = (
				await import(resolve(__dirname, "..", "commands", file))
			).default as ICommand;
			const body = {
				name: command.name,
				description: command.description,
				options: command.options,
			};
			await makeAPIRequest(
				`/applications/${CONFIG.CLIENT_ID}/commands`,
				"POST",
				body,
			);
			this.commands.set(command.name, command);
			pogger.success(`Command loaded: ${command.name}`);
		}
	}

	private async eventHandler() {
		const files = readdirSync(resolve(__dirname, "..", "events"));
		for (const file of files) {
			const event = (
				await import(resolve(__dirname, "..", "events", file))
			).default as IEvent;
			this.on(event.name, (...args: unknown[]) =>
				event.execute(this, ...args),
			);
			pogger.success(`Event loaded: ${event.name}`);
		}
	}

	public async connect(): Promise<string> {
		pogger.info("Loading files...");
		await this.eventHandler();
		await this.commandHandler();
		pogger.info("Connecting to MongoDB");
		await connect(CONFIG.MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
		});
		pogger.info("Connecting to Discord API");
		return await this.login(CONFIG.TOKEN);
	}
}

function random<T>(array: T[]): T {
	return array[Math.floor(Math.random() * array.length)];
}
