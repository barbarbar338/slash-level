import { Schema, model, Document } from "mongoose";

export interface IGuildModel extends Document {
	guildID: string;
	disabledChannels?: string[];
	disabledRoles?: string[];
	levelupChannel?: string;
	levelupMessage?: string;
	rewards?: {
		roleIDs: string[];
		level: number;
	}[];
}

export const GuildSchema = new Schema<IGuildModel>({
	guildID: {
		type: String,
		required: true,
	},
	disabledChannels: [String],
	disabledRoles: [String],
	levelupChannel: String,
	levelupMessage: String,
	rewards: Object,
});

export const GuildModel = model<IGuildModel>(
	"guildModel",
	GuildSchema,
	"GUILD_COLLECTION",
);
