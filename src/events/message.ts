import { Core } from "../struct/Core";
import { IEvent } from "my-module";
import { Message, Collection, TextChannel } from "discord.js";
import { GuildMemberModel } from "../models/GuildMemberModel";
import { GuildModel } from "../models/GuildModel";

const Cooldowns = new Collection<string, Collection<string, number>>();
const SlashRegToken = /<\/(\w{3,32}):(\d{17,19})>/g;

const MessageEvent: IEvent = {
	name: "message",
	execute: async (_client: Core, message: Message) => {
		if (
			!message.guild ||
			message.author.bot ||
			message.content.match(SlashRegToken)
		)
			return;
		const guildModel = await GuildModel.findOne({
			guildID: message.guild.id,
		});
		if (
			guildModel &&
			guildModel.disabledChannels &&
			guildModel.disabledChannels.includes(message.channel.id)
		)
			return;
		if (
			guildModel &&
			guildModel.disabledRoles &&
			guildModel.disabledRoles.some((roleID) =>
				message.member?.roles.cache.has(roleID),
			)
		)
			return;
		let GuildCooldown = Cooldowns.get(message.guild.id);
		if (!GuildCooldown) {
			GuildCooldown = new Collection<string, number>();
			Cooldowns.set(message.guild.id, GuildCooldown);
		}
		const userCooldown = GuildCooldown.get(message.author.id);
		const now = Date.now();
		if (userCooldown) {
			if (now - userCooldown < 1000 * 10) return;
			else GuildCooldown.set(message.author.id, now);
		} else GuildCooldown.set(message.author.id, now);
		let guildMemberModel = await GuildMemberModel.findOne({
			guildID: message.guild.id,
			userID: message.author.id,
		});
		if (!guildMemberModel)
			guildMemberModel = await GuildMemberModel.create({
				guildID: message.guild.id,
				userID: message.author.id,
				xp: 0,
				level: 0,
			});
		guildMemberModel.xp = guildMemberModel.xp + randomInt(5, 25);
		const { level, xp } = guildMemberModel;
		let leveled = false;
		const currentLevel = Math.floor(0.15 * Math.sqrt(xp + 1));
		if (currentLevel > level) {
			guildMemberModel.level = currentLevel;
			leveled = true;
		}
		await guildMemberModel.save();
		if (leveled) {
			let channel = message.channel;
			let levelupMessage =
				"%{member}, level up! You are now **%{level} level**. Thanks for chatting on **%{guild}**";
			if (guildModel) {
				if (guildModel.rewards) {
					const rewards = guildModel.rewards.filter(
						({ level }) => level <= currentLevel,
					);
					const addRoles = (flatten(
						rewards.map(({ roleIDs }) => roleIDs),
					) as string[]).filter(
						(roleID) => !message.member?.roles.cache.has(roleID),
					);
					if (addRoles) await message.member?.roles.add(addRoles);
				}
				if (guildModel.levelupChannel) {
					const levelupChannel = message.guild.channels.cache.get(
						guildModel.levelupChannel,
					);
					if (levelupChannel) channel = levelupChannel as TextChannel;
				}
				if (guildModel.levelupMessage)
					levelupMessage = guildModel.levelupMessage;
			}
			await channel.send(
				levelupMessage
					.replace(/%{level}/g, currentLevel.toString())
					.replace(/%{member}/g, message.member?.toString() as string)
					.replace(/%{guild}/g, message.guild?.name as string),
			);
		}
	},
};

function randomInt(min: number, max: number): number {
	return min + Math.floor((max - min) * Math.random());
}

function flatten(array: any[]): any[] {
	return array.reduce((acc, val) => [...acc, ...val], []);
}

export default MessageEvent;
