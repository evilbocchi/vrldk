/**
 * Invoke a callback at a set interval.
 * @param callback The callback to invoke.
 * @param interval The interval in seconds.
 * @returns A function to stop the interval.
 */
export function simpleInterval(callback: () => void, interval: number) {
	let active = true;
	const loop = () => {
		if (!active) return;
		callback();
		task.delay(interval, loop);
	};
	loop();
	return () => {
		active = false;
	};
}

/**
 * Invoke a callback with an interval defined in a mutable options object,
 * allowing for dynamic adjustment of the interval duration.
 * @param callback The callback to invoke.
 * @param options The options object containing the interval.
 * @returns A function to stop the interval.
 */
export function variableInterval(callback: () => void, options: { interval: number }) {
	let active = true;
	const loop = () => {
		if (!active) return;
		callback();
		task.delay(options.interval, loop);
	};
	loop();
	return () => {
		active = false;
	};
}
