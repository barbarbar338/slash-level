import { ICommand } from "my-module";
import { GuildMemberModel } from "../models/GuildMemberModel";
import { Guild, MessageEmbed } from "discord.js";
import { UserModel } from "../models/UserModel";
import { CONFIG } from "../config";

const RankCommand: ICommand = {
	name: "rank",
	description: "Shows the rank of you or the user you specified.",
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
		if (!user)
			return client.send(
				interaction,
				"I could not find the user you specified.",
			);
		const guildMemberModel = await GuildMemberModel.findOne({
			guildID: interaction.guild_id,
			userID: user.id,
		});
		if (!guildMemberModel)
			return client.send(
				interaction,
				"The user you specified has no level data. How would you like to start a chat with him/her?",
			);
		const ranks = await GuildMemberModel.find({
			guildID: interaction.guild_id,
		}).sort({
			xp: -1,
		});
		const index = ranks.findIndex(
			(guildMemberData) => guildMemberData.userID === user.id,
		);
		let userModel = await UserModel.findOne({
			userID: guildMemberModel.userID,
		});
		if (!userModel)
			userModel = await UserModel.create({
				userID: guildMemberModel.userID,
				rankColor: CONFIG.DEFAULT_RANK_COLOR,
			});
		const { xp, level } = guildMemberModel;
		const requiredXP = calculateRequiredExp(level + 1);
		const url = `${CONFIG.API_URL}/v2/canvas/rankcard?color=${encodeURIComponent(
			userModel.rankColor,
		)}&xp=${encodeURIComponent(xp)}&level=${encodeURIComponent(
			level,
		)}&xpToLevel=${encodeURIComponent(
			requiredXP,
		)}&position=${encodeURIComponent(index + 1)}&tag=${encodeURIComponent(
			user.tag,
		)}&status=${encodeURIComponent(
			user.presence.status,
		)}&avatarURL=${encodeURIComponent(
			user.displayAvatarURL({ format: "png" }),
		)}`;
		const member = (client.guilds.cache.get(
			interaction.guild_id,
		) as Guild).member(user);
		const embed = new MessageEmbed()
			.setColor(
				member ? member.displayHexColor : `#${userModel.rankColor}`,
			)
			.setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }), url)
			.setImage(url);
		return client.send(
			interaction,
			`🏆 Rank card of **${user.tag}**\n`,
			embed,
		);
	},
};

function calculateRequiredExp(level: number): number {
	return Math.floor((level / 0.15) * (level / 0.15));
}

export default RankCommand;
