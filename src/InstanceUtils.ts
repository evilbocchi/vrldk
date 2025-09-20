/**
 * Destroys the given instance after an optional delay.
 *
 * @param instance The instance to destroy. If not provided, nothing happens.
 * @param delayBeforeDestruction The delay in seconds before the instance is destroyed. If not provided, the instance is destroyed immediately.
 */
export function destroyInstance(instance?: Instance, delayBeforeDestruction?: number) {
	const destroy = () => {
		if (instance) {
			instance.Destroy();
		}
	};
	if (delayBeforeDestruction) {
		task.delay(delayBeforeDestruction, destroy);
	} else {
		destroy();
	}
}

/**
 * Finds all children of an instance with a specific name.
 *
 * @param instance The instance to search in.
 * @param name The name of the children to find.
 * @returns An array of instances with the specified name.
 */
export function findChildren(instance: Instance, name: string) {
	const found = new Array<Instance>();
	for (const child of instance.GetChildren()) {
		if (child.Name === name) {
			found.push(child);
		}
	}
	return found;
}

/**
 * Finds all models in the given instance and its children.
 *
 * @param instance The instance to search in.
 * @returns An array of descendants that are models found in the instance.
 */
export function findModels(instance: Instance): Model[] {
	let models = new Array<Model>();
	const children = instance.GetChildren();
	for (const child of children) {
		if (child.IsA("Folder")) {
			const found = findModels(child);
			models = [...models, ...found];
		} else if (child.IsA("Model")) {
			models.push(child);
		}
	}
	return models;
}
