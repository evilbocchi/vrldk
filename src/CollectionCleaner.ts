import { CollectionService, Workspace } from "@rbxts/services";

/**
 * Observe when a tag is added to an instance and run a callback.
 * Will also run the callback on all instances that already have the tag.
 * 
 * When the instance's parent is `nil`, the cleanup function will be called.
 * 
 * @param tag The tag to observe
 * @param callback The callback to run when the tag is added
 * @param workspaceOnly If true, only instances that are descendants of the Workspace will be observed
 * @returns A connection that can be disconnected to stop observing the tag
 */
export function observeTagAdded(tag: string, callback: (instance: Instance) => (() => void) | unknown, workspaceOnly = false) {
    const check = (instance: Instance) => {
        if (workspaceOnly === true && !instance.IsDescendantOf(Workspace))
            return;
        
        const cleanup = callback(instance);
        if (cleanup !== undefined) {
            const connection = instance.AncestryChanged.Connect((_, parent) => {
                if (parent === undefined) {
                    (cleanup as () => void)();
                    connection.Disconnect();
                }
            });
        }
    };
    const connection = CollectionService.GetInstanceAddedSignal(tag).Connect(check);
    CollectionService.GetTagged(tag).forEach(check);

    return connection;
}

/**
 * Observe when a tag is added and removed from an instance and run a callback.
 * Will also run the added callback on all instances that already have the tag.
 * 
 * @param tag The tag to observe
 * @param addedCallback The callback to run when the tag is added
 * @param removedCallback The callback to run when the tag is removed
 * @returns A function to disconnect both added and removed callbacks
 */
export function observeTag(tag: string, addedCallback: (instance: Instance) => void, removedCallback: (instance: Instance) => void) {
    const connection1 = observeTagAdded(tag, addedCallback);
    const connection2 = CollectionService.GetInstanceRemovedSignal(tag).Connect((instance) => {
        if (!instance.IsA("BasePart"))
            return;

        removedCallback(instance);
    });

    return () => {
        connection1.Disconnect();
        connection2.Disconnect();
    };
}