import { ICommand } from "my-module";
import { GuildModel } from "../models/GuildModel";

const EnableRoleCommand: ICommand = {
	name: "enablerole",
	description: "Enables the level system for the role you specified.",
	options: [
		{
			name: "role",
			description: "Role to be enabled",
			required: true,
			type: 8,
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
		const roleID = args[0].value;
		await GuildModel.updateOne(
			{ guildID: guild?.id },
			{
				$pull: {
					disabledRoles: roleID,
				},
			},
			{ upsert: true },
		);
		return client.send(
			interaction,
			"Level system has been enabled for the role you specified.",
		);
	},
};

export default EnableRoleCommand;
