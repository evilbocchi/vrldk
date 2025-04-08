declare global {
    interface InstanceInfo {

    }
}

/**
 * A map of instance to instance info.
 */
export const INFO_PER_INSTANCE = new Map<Instance, InstanceInfo>();

/**
 * Sets the instance info for the given instance.
 * 
 * @param instance The instance to set the info for.
 * @param key The key to set.
 * @param value The value to set.
 * @returns The instance info.
 */
export function setInstanceInfo<T extends keyof InstanceInfo>(instance: Instance, key: T, value: InstanceInfo[T]) {
    let info = INFO_PER_INSTANCE.get(instance);
    if (info === undefined) {
        info = {};
        instance.Destroying.Once(() => INFO_PER_INSTANCE.delete(instance));
        INFO_PER_INSTANCE.set(instance, info);
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
    let info = INFO_PER_INSTANCE.get(instance);
    if (info === undefined) {
        info = {};
        instance.Destroying.Once(() => INFO_PER_INSTANCE.delete(instance));
        INFO_PER_INSTANCE.set(instance, info);
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
export function getInstanceInfo<T extends keyof InstanceInfo>(instance: Instance, key: T) {
    const info = INFO_PER_INSTANCE.get(instance);
    if (info === undefined)
        return undefined;
    return info[key];
}