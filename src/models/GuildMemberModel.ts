import { Schema, model, Document } from "mongoose";

export interface IGuildMemberModel extends Document {
	guildID: string;
	userID: string;
	level: number;
	xp: number;
	messages: number;
}

export const GuildMemberSchema = new Schema<IGuildMemberModel>({
	guildID: {
		type: String,
		required: true,
	},
	userID: {
		type: String,
		required: true,
	},
	level: {
		type: Number,
		required: true,
		default: 0,
	},
	messages: {
		type: Number,
		required: true,
		default: 0,
	},
	xp: {
		type: Number,
		required: true,
		default: 0,
	},
});

export const GuildMemberModel = model<IGuildMemberModel>(
	"guildMemberModel",
	GuildMemberSchema,
	"GUILD_MEMBER_COLLECTION",
);
