import { SlashCommandBuilder } from "discord.js";
import { GuildModel } from "../models/GuildModel";

const SetMessageCommand: SlashLevel.ICommand = {
	builder: new SlashCommandBuilder()
		.setName("setmessage")
		.setDescription(
			"Sets the level up message of the server to be sent when someone levels up.",
		)
		.addStringOption((option) =>
			option
				.setName("message")
				.setDescription(
					"Level up message to set (%{member}, %{level}, %{guild})",
				)
				.setRequired(false),
		) as SlashCommandBuilder,
	isAdminOnly: true,
	async execute({ interaction }) {
		await interaction.deferReply({
			ephemeral: true,
		});

		const message = interaction.options.getString("message", false);

		await GuildModel.updateOne(
			{
				guildID: interaction.guild!.id,
			},
			{
				levelupMessage: message,
			},
			{ upsert: true },
		);

		let reply: string;
		if (message)
			reply =
				"Your server's level up message has been updated successfully.";
		else
			reply =
				"Your server's level up has been successfully reset. When someone levels up, the level message will be sent into the channel the user leveled up.";

		interaction.editReply({
			content: reply,
		});
	},
};

export default SetMessageCommand;
