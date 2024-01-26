import { EmbedBuilder } from "@discordjs/builders";
import { SlashCommandBuilder } from "discord.js";
import { UserModel } from "../models/UserModel";

const colorRegToken = /^#?[0-9a-f]{6}$/gi;

const SetColorCommand: SlashLevel.ICommand = {
	builder: new SlashCommandBuilder()
		.setName("setcolor")
		.setDescription("Sets the color of your profile card.")
		.addStringOption((option) =>
			option
				.setName("color")
				.setRequired(true)
				.setDescription("Color code you prefer.")
				.setMinLength(6)
				.setMaxLength(7),
		) as SlashCommandBuilder,
	isAdminOnly: false,
	async execute({ interaction }) {
		const color = interaction.options
			.getString("color", true)
			.replace("#", "");

		if (!color.match(colorRegToken))
			return interaction.reply({
				content:
					"The color code you specified is not a valid Hex code.",
				ephemeral: true,
			});

		await interaction.deferReply({
			ephemeral: true,
		});

		await UserModel.updateOne(
			{
				userID: interaction.user.id,
			},
			{
				rankColor: color,
			},
			{ upsert: true },
		);

		const embed = new EmbedBuilder()
			.setColor(parseInt(`0x${color}`))
			.setDescription(
				"Your color code has been updated successfully. Check out the color of the embed for a preview.",
			);

		interaction.editReply({
			embeds: [embed],
		});
	},
};

export default SetColorCommand;
