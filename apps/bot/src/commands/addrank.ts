import { SlashCommandBuilder } from "discord.js";
import { GuildModel } from "../models/GuildModel";

const AddRankCommand: SlashLevel.ICommand = {
	builder: new SlashCommandBuilder()
		.setName("addrank")
		.setDescription("Adds a reward role for the level you specified.")
		.addNumberOption((option) =>
			option
				.setName("level")
				.setDescription("The level at which the prize is awarded")
				.setRequired(true),
		)
		.addRoleOption((option) =>
			option
				.setName("role")
				.setDescription("Reward role")
				.setRequired(true),
		) as SlashCommandBuilder,
	isAdminOnly: true,
	async execute({ interaction }) {
		const prefferedLevel = interaction.options.getNumber("level", true);
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

		const guildModel = await GuildModel.findOne({
			guildID: interaction.guild!.id,
		});
		const rewards =
			guildModel && guildModel.rewards ? guildModel.rewards : [];
		let existing = rewards.find(({ level }) => level === prefferedLevel);
		if (existing) {
			if (!existing.roleIDs.includes(role.id))
				existing.roleIDs.push(role.id);
		} else
			existing = {
				level: prefferedLevel,
				roleIDs: [role.id],
			};

		const filtered = rewards.filter(
			({ level }) => level !== prefferedLevel,
		);
		filtered.push(existing);

		await GuildModel.updateOne(
			{ guildID: interaction.guild!.id },
			{ rewards: filtered },
			{ upsert: true },
		);

		interaction.editReply({
			content: "Reward has been successfully added.",
		});
	},
};

export default AddRankCommand;
