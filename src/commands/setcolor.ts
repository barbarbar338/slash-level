import { MessageEmbed } from "discord.js";
import { ICommand } from "my-module";
import { UserModel } from "../models/UserModel";

const colorRegToken = /^#?[0-9a-f]{6}$/gi;

const SetColorCommand: ICommand = {
	name: "setcolor",
	description: "Sets the color of your profile card.",
	options: [
		{
			name: "color",
			description: "Color code you prefer.",
			type: 3,
			required: true,
		},
	],
	async execute({ client, interaction, args }) {
		const color = args[0].value.replace("#", "");
		if (!color.match(colorRegToken))
			return client.send(
				interaction,
				"The color code you specified is not a valid Hex code.",
			);
		await UserModel.updateOne(
			{
				userID: interaction.member.user.id.toString(),
			},
			{
				rankColor: color,
			},
			{ upsert: true },
		);
		const embed = new MessageEmbed()
			.setColor(`#${color}`)
			.setDescription(
				"Your color code has been updated successfully. Check out the color of the embed for a preview.",
			);
		return client.send(interaction, "", embed);
	},
};

export default SetColorCommand;
