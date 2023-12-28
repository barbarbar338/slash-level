export class Utils {

	public getMaxNextLine = (input:any, maxChars = 20) => {
		// Split the string into an array of words.
		const allWords = input.split(" ");
		// Find the index in the words array at which we should stop or we will exceed
		// maximum characters.
		const lineIndex = allWords.reduce((prev: { done: any; position: number; }, cur: string | any[], index: any) => {
			if (prev?.done) return prev;
			const endLastWord = prev?.position || 0;
			const position = endLastWord + 1 + cur.length;
			return position >= maxChars ? {done: true, index} : {position, index};
		});
		// Using the index, build a string for this line ...
		const line = allWords.slice(0, lineIndex.index).join(" ");
		// And determine what's left.
		const remainingChars = allWords.slice(lineIndex.index).join(" ");
		// Return the result.
		return {line, remainingChars};
	};

	public formatTitle = (title:any) => {
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
	public random = <T>(array: T[]) =>
		array[Math.floor(Math.random() * array.length)];

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

		const short = " kMGTPE"[length / 3];

		return longNumber < 999 ? `${longNumber}` : (outputNum + short).trim();
	};
}
