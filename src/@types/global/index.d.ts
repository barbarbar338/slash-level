import {
	ChatInputCommandInteraction,
	ClientEvents,
	SlashCommandBuilder,
} from "discord.js";

export {};

declare global {
	namespace SlashLevel {
		export interface ICommand {
			builder: SlashCommandBuilder;
			isAdminOnly: boolean;
			execute: (commandArgs: CommandArgs) => any;
		}

		export interface CommandArgs {
			client: import("../../struct/Core").Core;
			interaction: ChatInputCommandInteraction;
		}

		export interface IEvent {
			name: keyof ClientEvents;
			execute: (
				client: import("../../struct/Core").Core,
				...args: any[]
			) => any;
		}
	}
}
