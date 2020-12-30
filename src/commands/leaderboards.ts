import { ICommand } from "my-module";
import { GuildMemberModel } from "../models/GuildMemberModel";
import { Guild, MessageEmbed } from "discord.js";

const LeaderboardsCommand: ICommand = {
	name: "leaderboards",
	description: "Shows the server leaderboards.",
	options: [
		{
			name: "user",
			description: "User to show rank. (Leave empty for personal rank)",
			type: 6,
			required: false,
		},
	],
	async execute({ client, interaction, args }) {
		const id =
			args && args.length
				? args[0].value
				: interaction.member.user.id.toString();
		const user = client.users.cache.get(id);
		const guild = client.guilds.cache.get(interaction.guild_id);
		let rank = "unknown";
		let xp = "unknown";
		let level = "unknown";
		let requiredXP = "unknown";
		let color = "GREEN";
		const ranks = await GuildMemberModel.find({
			guildID: interaction.guild_id,
		}).sort({
			xp: -1,
		});
		if (user) {
			const userIndex = ranks.findIndex(
				(guildMemberData) => guildMemberData.userID === user.id,
			);
			if (userIndex > -1) {
				rank = formatNumber(userIndex + 1);
				xp = formatNumber(ranks[userIndex].xp);
				level = formatNumber(ranks[userIndex].level);
				requiredXP = formatNumber(
					calculateRequiredExp(ranks[userIndex].level + 1),
				);
			}
			const member = (client.guilds.cache.get(
				interaction.guild_id,
			) as Guild).member(user);
			if (member) color = member.displayHexColor;
		}

		const embed = new MessageEmbed().setColor(color);
		const top5 = ranks.slice(0, 5);
		let content = "";
		for (let i = 0; i < top5.length; i++) {
			const guildMemberModel = top5[i];
			const tempUser = client.users.cache.get(guildMemberModel.userID);
			const userXp = formatNumber(guildMemberModel.xp);
			const userLevel = formatNumber(guildMemberModel.level);
			const userRequiredXP = formatNumber(
				calculateRequiredExp(guildMemberModel.level + 1),
			);
			content += `**#${i + 1}** - \`${
				tempUser ? tempUser.tag : guildMemberModel.userID
			}\` ${userLevel} Level - \`${userXp} / ${userRequiredXP} XP\`\n`;
		}
		embed.setDescription(content);
		if (user && rank) {
			embed.addField(
				`${user.tag}'s rank`,
				`**#${rank}** - \`${user.tag}\` ${level} Level - \`${xp} / ${requiredXP} XP\`\n`,
			);
		}
		return client.send(interaction, `📊 **${guild?.name}** Top 5`, embed);
	},
};

function calculateRequiredExp(level: number): number {
	return Math.floor((level / 0.15) * (level / 0.15));
}

function formatNumber(longNumber: number, defaultDecimal = 2): string {
	let length = longNumber.toString().length;
	const decimal = Math.pow(10, defaultDecimal);
	length -= length % 3;
	const outputNum =
		Math.round((longNumber * decimal) / Math.pow(10, length)) / decimal;
	const short = " kMGTPE"[length / 3];
	return (outputNum + short).trim();
}

export default LeaderboardsCommand;
