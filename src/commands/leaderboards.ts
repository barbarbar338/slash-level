import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { GuildMemberModel } from "../models/GuildMemberModel";

const LeaderboardsCommand: SlashLevel.ICommand = {
	builder: new SlashCommandBuilder()
		.setName("leaderboards")
		.setDescription("Shows the server leaderboards.")
		.addUserOption((option) =>
			option
				.setName("user")
				.setDescription(
					"User to show rank. (Leave empty for personal rank)",
				)
				.setRequired(false),
		) as SlashCommandBuilder,
	isAdminOnly: false,
	async execute({ client, interaction }) {
		const user = interaction.options.getUser("user", false);
		const id = user ? user.id : interaction.user.id;
		const member = interaction.guild!.members.cache.get(id);

		if (!member)
			return interaction.reply({
				content: "Member not found.",
				ephemeral: true,
			});

		await interaction.deferReply();

		let rank = "unknown";
		let xp = "unknown";
		let level = "unknown";
		let requiredXP = "unknown";

		const ranks = await GuildMemberModel.find({
			guildID: interaction.guild!.id,
		}).sort({
			xp: -1,
		});

		if (!ranks.length)
			return interaction.editReply({
				content: "No one has gained XP yet.",
			});

		const userIndex = ranks.findIndex(
			(guildMemberData) => guildMemberData.userID === member.id,
		);
		if (userIndex > -1) {
			rank = client.utils.formatNumber(userIndex + 1);
			xp = client.utils.formatNumber(ranks[userIndex].xp);
			level = client.utils.formatNumber(ranks[userIndex].level);
			requiredXP = client.utils.formatNumber(
				client.utils.calculateRequiredExp(ranks[userIndex].level + 1),
			);
		}

		const embed = new EmbedBuilder().setColor(member.displayHexColor);
		const top5 = ranks.slice(0, 5);

		let content = "";
		for (let i = 0; i < top5.length; i++) {
			const guildMemberModel = top5[i];
			const tempUser = client.users.cache.get(guildMemberModel.userID);
			const userXp = client.utils.formatNumber(guildMemberModel.xp);
			const userLevel = client.utils.formatNumber(guildMemberModel.level);
			const userRequiredXP = client.utils.formatNumber(
				client.utils.calculateRequiredExp(guildMemberModel.level + 1),
			);

			content += `**#${i + 1}** - \`${
				tempUser ? tempUser.tag : guildMemberModel.userID
			}\` ${userLevel} Level - \`${userXp} / ${userRequiredXP} XP\`\n`;
		}
		embed.setDescription(content);

		embed.addFields([
			{
				name: `${member.user.tag}'s rank`,
				value: `**#${rank}** - \`${member.user.tag}\` ${level} Level - \`${xp} / ${requiredXP} XP\`\n`,
			},
		]);

		interaction.editReply({
			content: `📊 **${interaction.guild!.name}** Top 5`,
			embeds: [embed],
		});
	},
};

export default LeaderboardsCommand;
