import { SlashCommandBuilder } from "discord.js";
import { GuildModel } from "../models/GuildModel";

const EnableRoleCommand: SlashLevel.ICommand = {
	builder: new SlashCommandBuilder()
		.setName("enablerole")
		.setDescription("Enables the level system for the role you specified.")
		.addRoleOption((option) =>
			option
				.setName("role")
				.setDescription("Role to be enabled")
				.setRequired(true),
		) as SlashCommandBuilder,
	isAdminOnly: true,
	async execute({ interaction }) {
		const role = interaction.guild?.roles.cache.get(
			interaction.options.getRole("role", true).id,
		);

		if (!role)
			return interaction.reply({
				content: "Role not found.",
				ephemeral: true,
			});

		if (!role.editable)
			return interaction.reply({
				content:
					"I do not have permission to manage the role you specified.",
				ephemeral: true,
			});

		await interaction.deferReply({
			ephemeral: true,
		});

		await GuildModel.updateOne(
			{ guildID: interaction.guild!.id },
			{
				$pull: {
					disabledRoles: role.id,
				},
			},
			{ upsert: true },
		);

		interaction.editReply({
			content:
				"Level system has been enabled for the role you specified.",
		});
	},
};

export default EnableRoleCommand;
