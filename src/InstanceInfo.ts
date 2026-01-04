declare global {
	/**
	 * Define instance information in this interface.
	 */
	interface InstanceInfo {}
}


/**
 * A map of instance to instance info.
 */
export let infoPerInstance = new Map<Instance, InstanceInfo>();

/** @deprecated badly named; use {@link infoPerInstance} instead */
export const INFO_PER_INSTANCE = infoPerInstance;

/**
 * Clears the old instance info map and sets a new one.
 * @param map The new map to set.
 */
export function setInfoPerInstanceMap(map: Map<Instance, InstanceInfo>) {
    infoPerInstance.clear();
	infoPerInstance = map;
}

/**
 * Sets the instance info for the given instance.
 *
 * @param instance The instance to set the info for.
 * @param key The key to set.
 * @param value The value to set.
 * @returns The instance info.
 */
export function setInstanceInfo<T extends keyof InstanceInfo>(instance: Instance, key: T, value: InstanceInfo[T]) {
	let info = infoPerInstance.get(instance);
	if (info === undefined) {
		info = {};
		instance.Destroying.Once(() => infoPerInstance.delete(instance));
		infoPerInstance.set(instance, info);
	}
	info[key] = value;
	return info;
}

/**
 * Gets the instance info for the given instance.
 *
 * @param instance The instance to get the info for.
 * @returns The instance info.
 */
export function getAllInstanceInfo(instance: Instance) {
	let info = infoPerInstance.get(instance);
	if (info === undefined) {
		info = {};
		instance.Destroying.Once(() => infoPerInstance.delete(instance));
		infoPerInstance.set(instance, info);
	}
	return info;
}

/**
 * Gets the instance info for the given instance.
 *
 * @param instance The instance to get the info for.
 * @param key The key to get.
 * @returns The instance info.
 */
export function getInstanceInfo<T extends keyof InstanceInfo>(instance: Instance, key: T): InstanceInfo[T] | undefined {
	const info = infoPerInstance.get(instance);
	if (info === undefined) return undefined;
	return info[key];
}
