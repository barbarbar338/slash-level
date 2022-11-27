import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { CONFIG } from "../config";

const InfoCommand: SlashLevel.ICommand = {
	builder: new SlashCommandBuilder()
		.setName("info")
		.setDescription("Gives information about bot."),
	isAdminOnly: false,
	async execute({ client, interaction }) {
		const embed = new EmbedBuilder()
			.setColor("Purple")
			.setAuthor({
				name: "Thank you for choosing SlashLevel",
				iconURL: client.user?.displayAvatarURL(),
				url: client.config.INVITE,
			})
			.setFooter({
				text: `Made with ❤️ by barbarbar338 and MuratvaStark`,
				iconURL:
					"https://cdn.338.rocks/v1/storage/uploads/branding/icon.png",
			})
			.addFields([
				{
					name: "1 - Add Bot",
					value: `[Click here](${client.config.INVITE})`,
				},
				{
					name: "2 - Join Support Server",
					value: `[Click here](${client.config.SUPPORT_SERVER})`,
				},
				{
					name: "3 - Star Repo",
					value: `[Click here](${client.config.REPO_URL})`,
				},
			])
			.setDescription(
				"SlashLevel offers your server a level system with `SlashCommand` feature. SlahCommand is a command system added to Discord with new update.\n\n" +
					"In order to benefit from this feature, **you have to invite the bot with `SlashCommand` invite url**.\n" +
					"After adding our bot and the SlashCommand feature to your server, you will see the commands and explanations offered by our bot by typing `/` in any of the text channels.\n\n" +
					"Here is an example, thanks for choosing us! (Don't worry, Papa Franku is our testing bot)",
			)
			.setImage(CONFIG.EXAMPLE_GIF);

		interaction.reply({
			content: "✨ The first SlashCommand based level bot ✨",
			embeds: [embed],
		});
	},
};

export default InfoCommand;
