import { SlashCommandBuilder } from "discord.js";

const PingCommand: SlashLevel.ICommand = {
	builder: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Shows the bot's ping."),
	isAdminOnly: false,
	async execute({ client, interaction }) {
		return interaction.reply({
			content: `:ping_pong: Pong! ${client.ws.ping}ms`,
		});
	},
};

export default PingCommand;
