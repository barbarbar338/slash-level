export class Utils {
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

		return (outputNum + short).trim();
	};
}
