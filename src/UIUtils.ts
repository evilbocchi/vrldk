/**
 * Sets the color of a UI object, respecting ColorIndependent property.
 *
 * @param object The UI object to set the color of.
 * @param color The color to set.
 * @param deepColor If true, also sets text color for TextLabels.
 */
export function setColor(object: Instance, color: Color3, deepColor?: boolean) {
	if (object.FindFirstChild("ColorIndependent")) {
		return;
	}
	if (object.IsA("UIStroke")) {
		object.Color = color;
	} else if (object.IsA("GuiObject")) {
		object.BackgroundColor3 = color;
	}
	if (deepColor) {
		if (object.IsA("TextLabel")) {
			object.TextColor3 = color;
		}
	}
}

/**
 * Paints an object and all its descendants with the specified color.
 *
 * @param objectsDirectory The parent object to start painting from.
 * @param color The color to paint with.
 * @param deepPaint If true, also sets text colors for TextLabels.
 */
export function paintObjects(objectsDirectory: Instance, color: Color3, deepPaint?: boolean) {
	setColor(objectsDirectory, color, deepPaint);
	for (const v of objectsDirectory.GetDescendants()) {
		setColor(v, color, deepPaint);
	}
}
