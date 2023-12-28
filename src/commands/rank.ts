import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { CONFIG } from "../config";
import { GuildMemberModel } from "../models/GuildMemberModel";
import { UserModel } from "../models/UserModel";
import { createCanvas, loadImage, registerFont } from "canvas";

registerFont(__dirname + '/../assets/fonts/Poppins-Bold.ttf', { family: 'Poppins Bold' });
registerFont(__dirname + '/../assets/fonts/Poppins-Light.ttf', { family: 'Poppins Light' });
registerFont(__dirname + '/../assets/fonts/Poppins-Regular.ttf', { family: 'Poppins Regular' });


const RankCommand: SlashLevel.ICommand = {
	builder: new SlashCommandBuilder()
		.setName("rank")
		.setDescription("Shows the rank of you or the user you specified.")
		.addUserOption((option) =>
			option
				.setName("user")
				.setDescription(
					"User to show rank. (Leave empty for personal rank)",
				)
				.setRequired(false),
		) as SlashCommandBuilder,
	isAdminOnly: false,
	async execute({ client, interaction }) {
		const user = interaction.options.getUser("user", false);
		const id = user ? user.id : interaction.user.id;
		const member = interaction.guild!.members.cache.get(id);

		if (!member)
			return interaction.reply({
				content: "Member not found.",
				ephemeral: true,
			});

		await interaction.deferReply();

		const guildMemberModel = await GuildMemberModel.findOne({
			guildID: interaction.guild!.id,
			userID: member.id,
		});
		if (!guildMemberModel)
			return interaction.editReply({
				content:
					"The user you specified has no level data. How would you like to start a chat with him/her?",
			});

		const ranks = await GuildMemberModel.find({
			guildID: interaction.guild!.id,
		}).sort({
			xp: -1,
		});

		const index = ranks.findIndex(
			(guildMemberData) => guildMemberData.userID === member.id,
		);

		let userModel = await UserModel.findOne({
			userID: guildMemberModel.userID,
		});
		if (!userModel)
			userModel = await UserModel.create({
				userID: guildMemberModel.userID,
				rankColor: CONFIG.DEFAULT_RANK_COLOR,
			});

		const { xp, level } = guildMemberModel;
		const requiredXP = client.utils.calculateRequiredExp(level + 1);


		const post = {
			nickname: member.user.tag,
			rank: level,
			xp: xp,
			toLevel: requiredXP,
			avatar: member.displayAvatarURL({
				extension: "png",
			})
		};

		const width = 840;
		const height = 214;

		const canvas = createCanvas(width, height);
		const context = canvas.getContext("2d");


		/** Background **/
		context.fillStyle = "#010144";
		context.fillRect(0, 0, width, height);
		/** Background **/

		/** Texts **/

		context.font = "16pt 'Poppins Regular'";
		context.textAlign = "left";
		context.fillStyle = "#fff";

		const titleText = client.utils.formatTitle(post.nickname);
		context.fillText(titleText[0], 254, 145);
		context.font = "13pt 'Poppins Light'";
		context.textAlign = "left";
		context.fillStyle = "#fff";
		context.fillText(client.utils.formatNumber(post.xp) + "/" + client.utils.formatNumber(post.toLevel), 680, 145);
		/** Texts **/

		/** Background PINS **/
		const pin = await loadImage(__dirname + "/../assets/pin1.png")
		context.drawImage(pin, 151, -8, 74, 74);
		const pin2 = await loadImage(__dirname + "/../assets/pin2.png")
		context.drawImage(pin2, 28, 56, 44, 44);
		const pin3 = await loadImage(__dirname + "/../assets/pin3.png")
		context.drawImage(pin3, -41, 121, 135, 135);
		const pin4 = await loadImage(__dirname + "/../assets/pin4.png")
		context.drawImage(pin4, 201, 170, 36, 36);
		const pin5 = await loadImage(__dirname + "/../assets/pin5.png")
		context.drawImage(pin5, 750, 171, 74, 73);
		const pin6 = await loadImage(__dirname + "/../assets/pin6.png")
		context.drawImage(pin6, 747, -40, 167, 167);
		/** Background PINS **/

		/** Progress BG and Background Objects **/
		const ellips = await loadImage(__dirname + "/../assets/ellips1.png")
		context.drawImage(ellips, -90, -144, 300, 300);
		const ellips2 = await loadImage(__dirname + "/../assets/ellips2.png")
		context.drawImage(ellips2, 610, 50, 300, 300);
		const progress = await loadImage(__dirname + "/../assets/progress.png")
		context.drawImage(progress, 254, 155, 506, 28);

		/** Progress BG and Background Objects **/

		/** Progress Bar **/
		function drawRoundedRect(ctx: {
			beginPath: () => void;
			moveTo: (arg0: any, arg1: any) => void;
			arcTo: (arg0: any, arg1: any, arg2: any, arg3: any, arg4: any) => void;
			closePath: () => void;
		}, x: number, y: number, width: number, height: number, radius: number) {
			ctx.beginPath();
			ctx.moveTo(x + radius, y);
			ctx.arcTo(x + width, y, x + width, y + height, radius);
			ctx.arcTo(x + width, y + height, x, y + height, radius);
			ctx.arcTo(x, y + height, x, y, radius);
			ctx.arcTo(x, y, x + width, y, radius);
			ctx.closePath();
		}

		const percentage = (post.xp / post.toLevel) * 506;
		const rectWidth = percentage;
		const rectHeight = 28;
		const cornerRadius = 15;

		drawRoundedRect(context, 254, 155, rectWidth, rectHeight, cornerRadius);
		context.fillStyle = '#8b17ef';
		context.fill();
		/** Progress Bar **/

		context.font = "11pt 'Poppins Bold'";
		context.textAlign = "left";
		context.fillStyle = "#fff";
		context.fillText(post.rank + ". Seviye", 264, 174);

		/** Avatar **/
		const avatar = await loadImage(post.avatar)
		context.font = "18pt 'Poppins Bold'";
		context.textAlign = "left";
		context.fillStyle = "#fff";
		context.fillText("Rank #" + post.rank, 630, 50);
		/** Avatar **/

		/** Avatar Decoration **/
		context.beginPath();
		context.arc(150, 107, 70, 0, Math.PI * 2, true);
		context.closePath();
		context.clip();
		context.drawImage(avatar, 80, 37, 140, 140);
		/** Avatar Decoration **/


		const buffer: any = canvas.toBuffer("image/png");
		const img = Buffer.from(buffer, 'base64');

		const url = `data:image/png;base64,${img}`;

		const embed = new EmbedBuilder()
			.setColor(
				member ? member.displayHexColor : `#${userModel.rankColor}`,
			)
			.setAuthor({
				name: member.user.tag,
				iconURL: member.displayAvatarURL({
					extension: "png",
				}),
				url,
			})
			.setImage(url);

		return interaction.editReply({
			content: `🏆 Rank card of **${member.user.tag}**`,
			embeds: [embed],
		});
	},
};

export default RankCommand;
