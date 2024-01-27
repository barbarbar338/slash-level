/**
 * Gets a random element from array
 * @template T
 * @param {Array<T>} arr array of elements
 * @returns {T} random element
 */
function getRandomElement(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Gets a random integer between `min` and `max`
 * @param {number} min lowest limit
 * @param {number} max highest limit
 * @returns {number} random integer between `min` and `max`
 */
function getRandomIntBetween(min, max) {
	return min + Math.floor(Math.random() * (max - min + 1));
}

/**
 * Flattens the array
 * @template T
 * @param {Array<Array<T>>} arr array of arrays
 * @returns {Array<T>} Flat array
 */
function flattenArray(arr) {
	return arr.reduce((acc, val) => [...acc, ...val], []);
}

/**
 * Formats the number like `1000 => 1k`
 * @param {number} num number to format
 * @returns {string} formatted number
 */
function formatNumber(num) {
	if (num < 1000) return num.toString();

	let length = num.toString().length;
	length -= length % 3;

	const decimal = Math.pow(10, 2);
	const outputNum =
		Math.round((num * decimal) / Math.pow(10, length)) / decimal;

	const short = " kMGTPE"[length / 3] || "";

	return (outputNum + short).trim();
}

export { flattenArray, formatNumber, getRandomElement, getRandomIntBetween };
