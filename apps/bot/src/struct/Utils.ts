import { createCanvas, loadImage } from "canvas";

export class Utils {
	public getMaxNextLine = (input: any, maxChars = 20) => {
		// Split the string into an array of words.
		const allWords = input.split(" ");
		// Find the index in the words array at which we should stop or we will exceed
		// maximum characters.
		const lineIndex = allWords.reduce(
			(
				prev: { done: any; position: number },
				cur: string | any[],
				index: any,
			) => {
				if (prev?.done) return prev;
				const endLastWord = prev?.position || 0;
				const position = endLastWord + 1 + cur.length;
				return position >= maxChars
					? { done: true, index }
					: { position, index };
			},
		);
		// Using the index, build a string for this line ...
		const line = allWords.slice(0, lineIndex.index).join(" ");
		// And determine what's left.
		const remainingChars = allWords.slice(lineIndex.index).join(" ");
		// Return the result.
		return { line, remainingChars };
	};

	public formatTitle = (title: any) => {
		let output: any = [];
		// If the title is 40 characters or longer, look to add ellipses at the end of
		// the second line.
		if (title.length >= 40) {
			const firstLine = this.getMaxNextLine(title);
			const secondLine = this.getMaxNextLine(firstLine.remainingChars);
			output = [firstLine.line];
			let fmSecondLine = secondLine.line;
			if (secondLine.remainingChars.length > 0) fmSecondLine += " ...";
			output.push(fmSecondLine);
		}
		// If 20 characters or longer, add the entire second line, using a max of half
		// the characters, making the first line always slightly shorter than the
		// second.
		else if (title.length >= 20) {
			const firstLine = this.getMaxNextLine(title, title.length / 2);
			output = [firstLine.line, firstLine.remainingChars];
		}
		// Otherwise, return the short title.
		else {
			output = [title];
		}

		return output;
	};
	public random = <T>(array: T[]): T =>
		array[Math.floor(Math.random() * array.length)] as T;

	public randomInt = (min: number, max: number) =>
		min + Math.floor((max - min) * Math.random());

	public flatten = <T>(array: T[][]) =>
		array.reduce((acc, val) => [...acc, ...val], []);

	public calculateRequiredExp = (level: number) =>
		Math.floor((level / 0.15) * (level / 0.15));

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

		const short = " kMGTPE"[length / 3] || "";

		return longNumber < 999 ? `${longNumber}` : (outputNum + short).trim();
	};

	public createImage = async (
		tag: any,
		level: any,
		xp: any,
		requiredXP: any,
		avatar: any,
		userTime: number,
	) => {
		const post = {
			nickname: tag,
			rank: level,
			xp: xp,
			toLevel: requiredXP,
			avatar: avatar,
			time: userTime,
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

		const titleText = this.formatTitle(post.nickname);
		context.fillText(titleText[0], 254, 145);
		context.font = "13pt 'Poppins Light'";
		context.textAlign = "left";
		context.fillStyle = "#fff";
		context.fillText(
			this.formatNumber(post.xp) + "/" + this.formatNumber(post.toLevel),
			680,
			145,
		);

		context.font = "13pt 'Poppins Light'";
		context.textAlign = "left";
		context.fillStyle = "#fff";
		context.fillText(
			"Voice Chat Time: " +
				String(Math.ceil(post.time / 1000 / 60) + "mins."),
			524,
			125,
		);
		/** Texts **/

		/** Background PINS **/
		const pin = await loadImage(__dirname + "/../assets/pin1.png");
		context.drawImage(pin, 151, -8, 74, 74);
		const pin2 = await loadImage(__dirname + "/../assets/pin2.png");
		context.drawImage(pin2, 28, 56, 44, 44);
		const pin3 = await loadImage(__dirname + "/../assets/pin3.png");
		context.drawImage(pin3, -41, 121, 135, 135);
		const pin4 = await loadImage(__dirname + "/../assets/pin4.png");
		context.drawImage(pin4, 201, 170, 36, 36);
		const pin5 = await loadImage(__dirname + "/../assets/pin5.png");
		context.drawImage(pin5, 750, 171, 74, 73);
		const pin6 = await loadImage(__dirname + "/../assets/pin6.png");
		context.drawImage(pin6, 747, -40, 167, 167);
		/** Background PINS **/

		/** Progress BG and Background Objects **/
		const ellips = await loadImage(__dirname + "/../assets/ellips1.png");
		context.drawImage(ellips, -90, -144, 300, 300);
		const ellips2 = await loadImage(__dirname + "/../assets/ellips2.png");
		context.drawImage(ellips2, 610, 50, 300, 300);
		const progress = await loadImage(__dirname + "/../assets/progress.png");
		context.drawImage(progress, 254, 155, 506, 28);

		/** Progress BG and Background Objects **/

		/** Progress Bar **/
		function drawRoundedRect(
			ctx: {
				beginPath: () => void;
				moveTo: (arg0: any, arg1: any) => void;
				arcTo: (
					arg0: any,
					arg1: any,
					arg2: any,
					arg3: any,
					arg4: any,
				) => void;
				closePath: () => void;
			},
			x: number,
			y: number,
			width: number,
			height: number,
			radius: number,
		) {
			ctx.beginPath();
			ctx.moveTo(x + radius, y);
			ctx.arcTo(x + width, y, x + width, y + height, radius);
			ctx.arcTo(x + width, y + height, x, y + height, radius);
			ctx.arcTo(x, y + height, x, y, radius);
			ctx.arcTo(x, y, x + width, y, radius);
			ctx.closePath();
		}

		const rectWidth = (post.xp / post.toLevel) * 506;
		const rectHeight = 28;
		const cornerRadius = 15;

		drawRoundedRect(context, 254, 155, rectWidth, rectHeight, cornerRadius);
		context.fillStyle = "#8b17ef";
		context.fill();
		/** Progress Bar **/

		context.font = "11pt 'Poppins Bold'";
		context.textAlign = "left";
		context.fillStyle = "#fff";
		context.fillText("Level " + post.rank, 264, 174);

		/** Avatar **/
		const avatarLink = await loadImage(post.avatar);
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
		context.drawImage(avatarLink, 80, 37, 140, 140);
		/** Avatar Decoration **/

		const buffer: any = canvas.toBuffer("image/png");

		return buffer;
	};
}
