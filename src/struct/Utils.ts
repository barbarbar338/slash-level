import { createCanvas, loadImage } from "canvas";
import * as sharp from "sharp";

const statusColors = {
	online: "#00ff00",
	invisible: "#d1d1e0",
	offline: "#d1d1e0",
	dnd: "#ff3300",
	idle: "#ffff00",
};

export class Utils {
	public random = <T>(array: T[]) =>
		array[Math.floor(Math.random() * array.length)];

	public randomInt = (min: number, max: number) =>
		min + Math.floor((max - min) * Math.random());

	public flatten = <T>(array: T[][]) =>
		array.reduce((acc, val) => [...acc, ...val], []);

	public calculateRequiredExp = (level: number) =>
		Math.floor(Math.pow(level / 0.15, 2));

	public resolveDBStatus = (state: number) => {
		switch (state) {
			case 0:
				return "Disconnected";
			case 1:
				return "Connected";
			case 2:
				return "Connecting";
			case 3:
				return "Disconnecting";
			default:
				return "Unknown";
		}
	};

	public formatNumber = (longNumber: number, defaultDecimal = 2) => {
		let length = longNumber.toString().length;
		length -= length % 3;

		const decimal = Math.pow(10, defaultDecimal);
		const outputNum =
			Math.round((longNumber * decimal) / Math.pow(10, length)) / decimal;

		const short = " kMGTPE"[length / 3];

		return longNumber < 999 ? `${longNumber}` : (outputNum + short).trim();
	};

	private invertColor(hex: string, bw: boolean): string {
		if (hex.indexOf("#") === 0) hex = hex.slice(1);
		if (hex.length === 3)
			hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
		const red = parseInt(hex.slice(0, 2), 16);
		const green = parseInt(hex.slice(2, 4), 16);
		const blue = parseInt(hex.slice(4, 6), 16);
		if (bw)
			return red * 0.299 + green * 0.587 + blue * 0.114 > 186
				? "#000000"
				: "#FFFFFF";
		const newRed = ([0, 0] + (255 - red).toString(16)).slice(-2);
		const newGreen = ([0, 0] + (255 - green).toString(16)).slice(-2);
		const newBlue = ([0, 0] + (255 - blue).toString(16)).slice(-2);
		return "#" + newRed + newGreen + newBlue;
	}

	private async toExtension(
		buffer: Buffer,
		extension: "png" | "jpeg" | "webp",
	) {
		return await sharp(buffer)
			[extension]({
				quality: 70,
			})
			.toBuffer();
	}

	public async createLevelCard(
		xp: number,
		level: number,
		xpToLevel: number,
		position: number,
		avatarURL: string,
		status: keyof typeof statusColors,
		tag: string,
		color: string,
		extension?: "png" | "jpeg" | "webp",
	): Promise<Buffer> {
		extension = extension ? extension : "png";

		const avatarImage = await loadImage(avatarURL);
		const percent = Math.floor((100 * xp) / xpToLevel);
		const barWidth = Math.floor((635 * percent) / 100);
		const defaultColor = color ? `#${color}` : "#248f24";

		const canvas = createCanvas(934, 282);
		const ctx = canvas.getContext("2d");

		ctx.fillStyle = "#23272A";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		const borderRadius10 = canvas.height * 0.1;
		ctx.fillStyle = "#16181A";
		ctx.beginPath();
		ctx.moveTo(20 + borderRadius10, 37);
		ctx.lineTo(910 - borderRadius10, 37);
		ctx.quadraticCurveTo(910, 37, 910, 37 + borderRadius10);
		ctx.lineTo(910, 248 - borderRadius10);
		ctx.quadraticCurveTo(910, 248, 910 - borderRadius10, 248);
		ctx.lineTo(20 + borderRadius10, 248);
		ctx.quadraticCurveTo(20, 248, 20, 248 - borderRadius10);
		ctx.lineTo(20, 37 + borderRadius10);
		ctx.quadraticCurveTo(20, 37, 20 + borderRadius10, 37);
		ctx.closePath();
		ctx.fill();

		const avatarRadius = 80;
		const avatarX = 43 + avatarRadius;
		const avatarY = 63 + avatarRadius;
		ctx.save();
		ctx.beginPath();
		ctx.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.clip();
		ctx.drawImage(avatarImage, 43, 63, 160, 160);
		ctx.restore();

		ctx.lineWidth = 4;
		ctx.strokeStyle = "#000000";
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(185, 195, 20, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.lineWidth = 8;
		ctx.strokeStyle = "#000000";
		ctx.stroke();
		ctx.fillStyle = statusColors[status];

		ctx.fill();

		ctx.fillStyle = "#484b4e";
		ctx.fillRect(256, 179, 635, 34);

		ctx.lineWidth = 2;
		ctx.strokeStyle = "#000000";
		ctx.stroke();

		ctx.fillStyle = defaultColor;
		ctx.fillRect(256, 180, barWidth, 32);

		ctx.fillStyle = "#FEFEFE";
		ctx.font = "24px Sans";
		ctx.textAlign = "start";
		ctx.fillText(tag, 260, 165);

		ctx.textAlign = "right";
		ctx.fillStyle = "#7F8384";
		ctx.fillText("/ " + this.formatNumber(xpToLevel) + " XP", 880, 165);

		const { width } = ctx.measureText(
			"/ " + this.formatNumber(xpToLevel) + " XP",
		);

		ctx.fillStyle = "#FEFEFE";
		ctx.fillText(this.formatNumber(xp), 870 - width, 165);

		ctx.fillStyle = this.invertColor(defaultColor, true);
		ctx.fillText(this.formatNumber(level) + " Level", 640, 205);

		ctx.fillStyle = defaultColor;
		ctx.textAlign = "right";
		ctx.fillText(`Rank: #${this.formatNumber(position)}`, 870, 90);

		const canvasBuffer = canvas.toBuffer();

		const buffer = await this.toExtension(canvasBuffer, extension);

		return buffer;
	}
}
