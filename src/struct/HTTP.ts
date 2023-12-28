import { Logger } from "@hammerhq/logger";
import * as express from "express";
import { connection } from "mongoose";
import { CONFIG } from "../config";
import { Core } from "./Core";

export class HTTP {
	private readonly app = express();
	private readonly logger = new Logger("[HTTP]:");

	constructor(private readonly client: Core) {}

	private handleRoutes() {
		this.app.get("/", (req, res) => {
			res.status(200).json({
				client_ping: this.client.ws.ping,
				uptime: this.client.uptime,
				database: this.client.utils.resolveDBStatus(
					connection.readyState,
				),
			});
		});

		this.app.get("/imageApi", async (req, res) => {
			const { xp, xpToLevel, level, avatarURL, tag, status } = req.query;
			const { createCanvas, loadImage, registerFont } = require("canvas");
			const post = {
				nickname: tag,
				rank: level,
				xp: xp,
				toLevel: xpToLevel,
				avatar: avatarURL
			};

			const width = 840;
			const height = 214;

			const canvas = createCanvas(width, height);
			const context = canvas.getContext("2d");
			registerFont(__dirname + '/../assets/fonts/Poppins-Bold.ttf', { family: 'Poppins Bold' });
			registerFont(__dirname + '/../assets/fonts/Poppins-Light.ttf', { family: 'Poppins Light' });
			registerFont(__dirname + '/../assets/fonts/Poppins-Regular.ttf', { family: 'Poppins Regular' });

			/** Background **/
			context.fillStyle = "#010144";
			context.fillRect(0, 0, width, height);
			/** Background **/

			/** Texts **/

			context.font = "16pt 'Poppins Regular'";
			context.textAlign = "left";
			context.fillStyle = "#fff";

			const titleText = this.client.utils.formatTitle(post.nickname);
			context.fillText(titleText[0], 254, 145);
			context.font = "13pt 'Poppins Light'";
			context.textAlign = "left";
			context.fillStyle = "#fff";
			context.fillText(this.client.utils.formatNumber(parseInt(<string>post.xp)) + "/" + this.client.utils.formatNumber(parseInt(<string>post.toLevel)), 680, 145);
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

			const percentage = (parseInt(<string>post.xp) / parseInt(<string>post.toLevel)) * 506;
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


			const buffer = canvas.toBuffer("image/png");
			const img = Buffer.from(buffer, 'base64');

			res.writeHead(200, {
				'Content-Type': 'image/png',
				'Content-Length': img.length
			});
			res.end(img);
		});

		this.app.use((req, res) => {
			res.sendStatus(200);
		});
	}

	public init() {
		this.handleRoutes();

		this.app.listen(CONFIG.PORT, "0.0.0.0", () => {
			this.logger.info(`Listening on port ${CONFIG.PORT}`);
		});
	}
}
