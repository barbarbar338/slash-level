import { ICommand } from "my-module";
import { GuildModel } from "../models/GuildModel";

const DisableChannelCommand: ICommand = {
	name: "disablechannel",
	description: "Disables the level system on the channel you specified.",
	options: [
		{
			name: "channel",
			description: "Channel to be disabled",
			required: true,
			type: 7,
		},
	],
	async execute({ client, interaction, args }) {
		const guild = client.guilds.cache.get(interaction.guild_id);
		const member = guild?.members.cache.get(
			interaction.member.user.id.toString(),
		);
		if (!member || !member.permissions.has("ADMINISTRATOR"))
			return client.send(
				interaction,
				"You need `ADMINISTRATOR` permission to use this command.",
			);
		const channelID = args[0].value;
		const channel = guild?.channels.cache.get(channelID);
		if (channel?.type !== "text")
			return client.send(
				interaction,
				"The channel you specified must be a text channel.",
			);
		await GuildModel.updateOne(
			{ guildID: guild?.id },
			{
				$addToSet: {
					disabledChannels: channelID,
				},
			},
			{ upsert: true },
		);
		return client.send(
			interaction,
			"Level system has been disabled for the channel you specified.",
		);
	},
};

export default DisableChannelCommand;
