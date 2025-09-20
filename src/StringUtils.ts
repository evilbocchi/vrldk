import StringBuilder from "@rbxts/stringbuilder";

type FontWeight = keyof typeof Enum.FontWeight;

/**
 * Simple English listing of items using commas and "and".
 *
 * @param strings The strings to combine.
 * @returns The combined string.
 */
export function combineHumanReadable(...strings: string[]) {
	let label = "";
	let i = 1;
	let size = strings.size();
	for (const c of strings) {
		if (c === "") {
			--size;
			continue;
		}
		label += c;
		if (i < size) {
			label += ", ";
		}
		++i;
	}
	return label;
}

/**
 * Build a string with rich text.
 *
 * @param builder The string builder to append to.
 * @param text The text to format.
 * @param color The color of the text.
 * @param size The size of the text.
 * @param weight The weight of the text. ("Thin" | "Light" | "Regular" | "Medium" | "SemiBold" | "Bold" | "ExtraBold" | "Heavy")
 * @returns A string builder with the formatted text.
 */
export function buildRichText(
	builder: StringBuilder | undefined,
	text: unknown,
	color?: Color3,
	size?: number,
	weight?: FontWeight | number,
) {
	if (builder === undefined) builder = new StringBuilder("<font");
	else builder.append("<font");

	if (color !== undefined) builder.append(` color="#${color.ToHex()}"`);
	if (size !== undefined) builder.append(` size="${size}"`);
	if (weight !== undefined) builder.append(` weight="${weight}"`);

	return builder.append(`>${text}</font>`);
}

/**
 * Formats a string with rich text.
 *
 * @param text The text to format.
 * @param color The color of the text.
 * @param size The size of the text.
 * @param weight The weight of the text. ("Thin" | "Light" | "Regular" | "Medium" | "SemiBold" | "Bold" | "ExtraBold" | "Heavy")
 * @returns The formatted text.
 */
export function formatRichText(text: unknown, color?: Color3, size?: number, weight?: FontWeight | number) {
	return buildRichText(new StringBuilder(), text, color, size, weight).toString();
}

/**
 * Builds a text gradient using rich text formatting.
 *
 * @param text The text to apply the gradient to.
 * @param color1 The starting color of the gradient.
 * @param color2 The ending color of the gradient.
 * @returns A StringBuilder containing the rich text with gradient effect.
 */
export function buildGradient(text: string, color1: Color3, color2: Color3) {
	const builder = new StringBuilder();
	const size = text.size();
	for (let i = 1; i <= size; i++) {
		buildRichText(builder, text.sub(i, i), color1.Lerp(color2, i / size));
	}
	return builder;
}

/**
 * Formats text with a gradient effect using rich text.
 *
 * @param text The text to apply the gradient to.
 * @param color1 The starting color of the gradient.
 * @param color2 The ending color of the gradient.
 * @returns A string with rich text formatting for gradient effect.
 */
export function formatGradient(text: string, color1: Color3, color2: Color3) {
	return buildGradient(text, color1, color2).toString();
}
