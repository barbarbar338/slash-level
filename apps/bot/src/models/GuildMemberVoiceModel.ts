import { Schema, model, Document } from "mongoose";

export interface IGuildMemberVoiceModel extends Document {
	guildID: string;
	userID: string;
	time: number;
	month: string;
}

export const GuildMemberVoiceSchema = new Schema<IGuildMemberVoiceModel>({
	guildID: {
		type: String,
		required: true,
	},
	userID: {
		type: String,
		required: true,
	},
	time: {
		type: Number,
		required: true,
		default: 0,
	},
	month: {
		type: String,
		required: true,
		default: "0",
	},
});

export const GuildMemberVoiceModel = model<IGuildMemberVoiceModel>(
	"guildMemberVoiceModel",
	GuildMemberVoiceSchema,
	"GUILD_MEMBER_VOICE_COLLECTION",
);
