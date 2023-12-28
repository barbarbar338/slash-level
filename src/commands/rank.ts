import { Embed, EmbedBuilder, SlashCommandBuilder,AttachmentBuilder } from "discord.js";
import { CONFIG } from "../config";
import { GuildMemberModel } from "../models/GuildMemberModel";
import { UserModel } from "../models/UserModel";
import { createCanvas, loadImage, registerFont } from "canvas";

registerFont(__dirname + '/../assets/fonts/Poppins-Bold.ttf', { family: 'Poppins Bold' });
registerFont(__dirname + '/../assets/fonts/Poppins-Light.ttf', { family: 'Poppins Light' });
registerFont(__dirname + '/../assets/fonts/Poppins-Regular.ttf', { family: 'Poppins Regular' });


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
			return interaction.editReply({
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


		const img = await client.utils.createImage(member.user.tag,level,xp,requiredXP,member.displayAvatarURL({
			extension: "png",
		}))


		const file = new AttachmentBuilder(img);
		return interaction.editReply({
			content: `🏆 Rank card of **${member.user.tag}**`,
			files: [file]
		});
	},
};

export default RankCommand;
