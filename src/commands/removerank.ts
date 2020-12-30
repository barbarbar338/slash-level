import { ICommand } from "my-module";
import { GuildModel } from "../models/GuildModel";

const RemoveRankCommand: ICommand = {
	name: "removerank",
	description: "Remove a reward role for the level you specified.",
	options: [
		{
			name: "level",
			description: "The level at which the prize is awarded",
			required: true,
			type: 4,
		},
		{
			name: "role",
			description: "Reward role",
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
		const prefferedLevel = parseInt(args[0].value);
		const role = guild?.roles.cache.get(args[1].value);
		if (!role?.editable)
			return client.send(
				interaction,
				"I do not have permission to manage the role you specified.",
			);
		const guildModel = await GuildModel.findOne({
			guildID: guild?.id,
		});
		let rewards =
			guildModel && guildModel.rewards ? guildModel.rewards : [];
		const existing = rewards.find(({ level }) => level === prefferedLevel);
		if (existing) {
			existing.roleIDs = existing.roleIDs.filter((id) => id !== role.id);
			rewards = rewards.filter(({ level }) => level !== prefferedLevel);
			if (existing.roleIDs.length) rewards.push(existing);
			await GuildModel.updateOne(
				{ guildID: guild?.id },
				{ rewards },
				{ upsert: true },
			);
		}
		client.send(interaction, "Reward has been successfully removed.");
	},
};

export default RemoveRankCommand;
