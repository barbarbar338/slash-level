import { ICommand } from "my-module";
import { GuildModel } from "../models/GuildModel";

const SetMessageCommand: ICommand = {
	name: "setmessage",
	description:
		"Sets the level up message of the server to be sent when someone levels up. use %{member} to mention member,  %{level} to see member's level and %{guild} to use guild's name.",
	options: [
		{
			name: "message",
			description: "Level up message to set",
			required: false,
			type: 3,
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
					levelupMessage: args[0].value,
				},
				{ upsert: true },
			);
			return client.send(
				interaction,
				"Your server's level up message has been updated successfully.",
			);
		} else {
			await GuildModel.updateOne(
				{
					guildID: interaction.guild_id,
				},
				{
					levelupMessage: undefined,
				},
				{ upsert: true },
			);
			return client.send(
				interaction,
				"Your server's level up has been successfully reset. When someone levels up, the level message will be sent into the channel the user leveled up.",
			);
		}
	},
};

export default SetMessageCommand;
