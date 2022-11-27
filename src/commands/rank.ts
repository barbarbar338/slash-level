import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { CONFIG } from "../config";
import { GuildMemberModel } from "../models/GuildMemberModel";
import { UserModel } from "../models/UserModel";

const RankCommand: SlashLevel.ICommand = {
	builder: new SlashCommandBuilder()
		.setName("rank")
		.setDescription("Shows the rank of you or the user you specified.")
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

		const guildMemberModel = await GuildMemberModel.findOne({
			guildID: interaction.guild!.id,
			userID: member.id,
		});
		if (!guildMemberModel)
			return interaction.reply({
				content:
					"The user you specified has no level data. How would you like to start a chat with him/her?",
			});

		const ranks = await GuildMemberModel.find({
			guildID: interaction.guild!.id,
		}).sort({
			xp: -1,
		});

		const index = ranks.findIndex(
			(guildMemberData) => guildMemberData.userID === member.id,
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
		const requiredXP = client.utils.calculateRequiredExp(level + 1);

		const url = `${
			CONFIG.IMAGE_API_URL
		}/v2/canvas/rankcard?color=${encodeURIComponent(
			userModel.rankColor,
		)}&xp=${encodeURIComponent(xp)}&level=${encodeURIComponent(
			level,
		)}&xpToLevel=${encodeURIComponent(
			requiredXP,
		)}&position=${encodeURIComponent(index + 1)}&tag=${encodeURIComponent(
			member.user.tag,
		)}&status=${encodeURIComponent(
			member.presence?.status || "invisible",
		)}&avatarURL=${encodeURIComponent(
			member.displayAvatarURL({
				extension: "png",
			}),
		)}`;

		const embed = new EmbedBuilder()
			.setColor(
				member ? member.displayHexColor : `#${userModel.rankColor}`,
			)
			.setAuthor({
				name: member.user.tag,
				iconURL: member.displayAvatarURL({
					extension: "png",
				}),
				url,
			})
			.setImage(url);

		return interaction.editReply({
			content: `🏆 Rank card of **${member.user.tag}**`,
			embeds: [embed],
		});
	},
};

export default RankCommand;
