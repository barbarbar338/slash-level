import { ChannelType, SlashCommandBuilder } from "discord.js";
import { GuildModel } from "../models/GuildModel";

const EnableChannelCommand: SlashLevel.ICommand = {
	builder: new SlashCommandBuilder()
		.setName("enablechannel")
		.setDescription(
			"Enables the level system on the channel you specified.",
		)
		.addChannelOption((option) =>
			option
				.setName("channel")
				.setDescription("Channel to be enabled")
				.setRequired(true),
		) as SlashCommandBuilder,
	isAdminOnly: true,
	async execute({ interaction }) {
		const channel = interaction.guild!.channels.cache.get(
			interaction.options.getChannel("channel", true).id,
		);
		if (!channel)
			return interaction.reply({
				content: "Channel not found.",
				ephemeral: true,
			});

		if (channel.type != ChannelType.GuildText)
			return interaction.reply({
				content: "The channel you specified is not a text channel.",
				ephemeral: true,
			});

		await interaction.deferReply({
			ephemeral: true,
		});

		await GuildModel.updateOne(
			{ guildID: interaction.guild!.id },
			{
				$pull: {
					disabledChannels: channel.id,
				},
			},
			{ upsert: true },
		);

		interaction.editReply({
			content:
				"Level system has been enabled for the channel you specified.",
		});
	},
};

export default EnableChannelCommand;
