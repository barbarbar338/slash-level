import { GuildMemberVoiceModel } from "../models/GuildMemberVoiceModel";
import { VoiceState } from "discord.js";

const VoiceStateUpdateEvent: SlashLevel.IEvent = {
	name: "voiceStateUpdate",
	execute: async (client,oldState:VoiceState, newState:VoiceState) => {
		const member = oldState.member || newState.member;
		if (!member) return;

		if (!newState.channel && oldState.channel) {
			const joinedTimestamp = client.voiceUsers.get(member.id);
			if (!joinedTimestamp) return;
			const totalTime = new Date().getTime() - joinedTimestamp;
			const dateObj = new Date();
			const month = dateObj.getUTCMonth() + 1;
			const year = dateObj.getUTCFullYear();
			const newDate = `${year}/${month}`;
			let voiceModel = await GuildMemberVoiceModel.findOne({
				guildID: member.guild.id,
				userID: member.id,
				month: newDate
			});
			if (!voiceModel) {
				voiceModel = await GuildMemberVoiceModel.create({
					guildID: member.guild.id,
					userID: member.user.id,
					time: totalTime,
					month: newDate
				});
			} else {
				voiceModel.time = voiceModel.time + totalTime;
			}
			await voiceModel.save();

		} else if (!oldState.channel && newState.channel) {

			const time = new Date().getTime();
			client.voiceUsers.set(member.id, time);
		} else {
		}
	}
};

export default VoiceStateUpdateEvent;
