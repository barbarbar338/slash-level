import { ICommand } from "my-module";
import { GuildModel } from "../models/GuildModel";

const SetChannelCommand: ICommand = {
	name: "setchannel",
	description:
		"Sets the channel of the server where the message will be sent when someone levels up.",
	options: [
		{
			name: "channel",
			description: "Channel to set",
			required: false,
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
		if (args) {
			await GuildModel.updateOne(
				{
					guildID: interaction.guild_id,
				},
				{
					levelupChannel: args[0].value,
				},
				{ upsert: true },
			);
			return client.send(
				interaction,
				"Your server's level up channel has been updated successfully.",
			);
		} else {
			await GuildModel.updateOne(
				{
					guildID: interaction.guild_id,
				},
				{
					levelupChannel: undefined,
				},
				{ upsert: true },
			);
			return client.send(
				interaction,
				"Your server's level channel has been successfully reset. When someone levels up, the level message will be sent into the channel the user leveled up.",
			);
		}
	},
};

export default SetChannelCommand;
