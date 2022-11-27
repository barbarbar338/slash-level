import { SlashCommandBuilder } from "discord.js";
import { GuildModel } from "../models/GuildModel";

const SetChannelCommand: SlashLevel.ICommand = {
	builder: new SlashCommandBuilder()
		.setName("setchannel")
		.setDescription(
			"Sets the channel of the server where the message will be sent when someone levels up.",
		)
		.addChannelOption((option) =>
			option
				.setName("channel")
				.setDescription("Channel to set")
				.setRequired(false),
		) as SlashCommandBuilder,
	isAdminOnly: false,
	async execute({ interaction }) {
		await interaction.deferReply({
			ephemeral: true,
		});

		const channel = interaction.options.getChannel("channel", false);
		await GuildModel.updateOne(
			{
				guildID: interaction.guild!.id,
			},
			{
				levelupChannel: channel ? channel.id : null,
			},
			{ upsert: true },
		);

		let reply: string;

		if (channel)
			reply =
				"Your server's level up channel has been updated successfully.";
		else
			reply =
				"Your server's level channel has been successfully reset. When someone levels up, the level message will be sent into the channel the user leveled up.";

		interaction.editReply({
			content: reply,
		});
	},
};

export default SetChannelCommand;
