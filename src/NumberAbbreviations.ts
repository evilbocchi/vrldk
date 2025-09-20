/**
 * Converts seconds to a formatted HH:MM:SS time string.
 *
 * @param seconds The number of seconds to convert.
 * @returns A string in the format "HH:MM:SS".
 */
export function convertToHHMMSS(seconds: number) {
	const minutes = (seconds - (seconds % 60)) / 60;
	const hours = (minutes - (minutes % 60)) / 60;
	return (
		string.format("%02i", hours) +
		":" +
		string.format("%02i", minutes - hours * 60) +
		":" +
		string.format("%02i", seconds - minutes * 60)
	);
}

/**
 * Converts seconds to a formatted MM:SS time string.
 *
 * @param seconds The number of seconds to convert.
 * @returns A string in the format "MM:SS".
 */
export function convertToMMSS(seconds: number): string {
	const remainder = seconds - math.floor(seconds / 60) * 60;
	return (
		tostring(math.floor(seconds / 60)) + ":" + (remainder < 10 ? "0" + tostring(remainder) : tostring(remainder))
	);
}
