declare module "my-module" {
	export interface LooseObject {
		[key: string]: unknown;
	}
	export interface SlashArgs {
		name: string;
		value: string;
	}
	export interface SlashResponse {
		type: number;
		token: string;
		member: {
			user: {
				id: number;
				username: string;
				avatar: string;
				discriminator: string;
				public_flags: number;
			};
			roles: string[];
			premium_since?: string;
			permissions: string;
			pending: false;
			nick?: string;
			mute: false;
			joined_at: string;
			is_pending: boolean;
			deaf: boolean;
		};
		id: string;
		guild_id: string;
		data: {
			options: SlashArgs[];
			name: string;
			id: string;
		};
		channel_id: string;
	}
	export interface ICommand {
		name: string;
		description: string;
		options: SlashOptions[];
		execute: (commandArgs: CommandArgs) => Promise<unknown>;
	}
	export interface CommandArgs {
		client: import("../../struct/Core").Core;
		interaction: SlashResponse;
		args: SlashArgs[];
	}
	export interface SlashOptions {
		name: string;
		description: string;
		type: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
		required: boolean;
		choices?: {
			name: string;
			value: string;
		}[];
	}
	export interface IEvent {
		name: string;
		execute: (
			client: import("../../struct/Core").Core,
			...args: any[]
		) => Promise<void>;
	}
	export interface RawSlashEvent {
		t: string;
		s: number;
		op: number;
		d: SlashResponse;
	}
}
