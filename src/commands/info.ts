import { Guild, MessageEmbed } from "discord.js";
import { ICommand } from "my-module";
import { CONFIG } from "../config";

const InfoCommand: ICommand = {
	name: "info",
	description: "Gives information about bot.",
	options: [],
	async execute({ client, interaction }) {
		const member = (client.guilds.cache.get(
			interaction.guild_id,
		) as Guild).member(interaction.member.user.id.toString());
		const embed = new MessageEmbed()
			.setColor(member ? member.displayHexColor : "GREEN")
			.setAuthor(
				"Thank you for choosing SlashLevel",
				client.user?.displayAvatarURL(),
				CONFIG.SLASH_INVITE,
			)
			.setFooter("Made with ❤ by barbarbar338 and MuratvaStark")
			.addField("1 - Add Commands", `[Click!](${CONFIG.SLASH_INVITE})`)
			.addField("2 - Invite Bot", `[Click!](${CONFIG.DEFAULT_INVITE})`)
			.setDescription(
				"SlashLevel offers your server a level system with `SlashCommand` feature. SlahCommand is a command system added to Discord with new update.\n\n" +
					"In order to benefit from this feature, **you have to invite the bot with `SlashCommand` invite url**.\n" +
					"After adding our bot and the SlashCommand feature to your server, you will see the commands and explanations offered by our bot by typing `/` in any of the text channels.\n\n" +
					"Here is an example, thanks for choosing us! (Don't worry, Papa Franku is our testing bot)",
			)
			.setImage("https://bariscodes.me/slash-example.gif");
		return client.send(
			interaction,
			"✨ The first and only SlashCommand based level bot ✨",
			embed,
		);
	},
};

export default InfoCommand;
