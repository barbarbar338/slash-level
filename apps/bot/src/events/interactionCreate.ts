import { Interaction } from "discord.js";

const InteractionCreateEvent: SlashLevel.IEvent = {
	name: "interactionCreate",
	execute: async (client, interaction: Interaction) => {
		if (!interaction.inGuild()) return;
		if (!interaction.isChatInputCommand()) return;

		const command = client.commands.get(interaction.commandName);
		if (!command) return;

		if (command.isAdminOnly) {
			const member = interaction.guild?.members.cache.get(
				interaction.user.id,
			);
			if (!member || !member.permissions.has("Administrator"))
				return interaction.reply({
					content:
						"You need `Administrator` permission to use this command.",
					ephemeral: true,
				});
		}

		command.execute({ client, interaction });
	},
};

export default InteractionCreateEvent;
