import { Players } from "@rbxts/services";

export namespace Streaming {

    /** The radius in studs within which streaming events will be sent to players */
    export let streamingRadius = 64;

    /**
     * Sends a remote event to nearby players.
     *
     * @param remote Remote event to send.
     * @param args Arguments to pass to the remote event.
     */
    export function fireNearby(remote?: Instance, ...args: unknown[]) {
        if (remote === undefined)
            return;

        const parent = remote.Parent;
        if (parent === undefined || !parent.IsA("BasePart"))
            return;

        const position = parent.Position;
        const players = Players.GetPlayers();
        for (const player of players) {
            if (player.Character === undefined || player.Character.PrimaryPart === undefined)
                continue;
            if (position.sub(player.Character.PrimaryPart.Position).Magnitude < streamingRadius) {
                (remote as RemoteEvent).FireClient(player, ...args);
            }
        }
    }

    /**
     * Executes a callback when a model's PrimaryPart becomes available.
     * Provides a cleanup function that will be called when the PrimaryPart is removed.
     * 
     * @param model The model to watch for PrimaryPart changes.
     * @param callback Function called with the primaryPart when it becomes available.
     * @returns A connection that can be disconnected to stop watching.
     */
    export const onModelStreamIn = (model: Model, callback: (primaryPart: BasePart) => (() => void) | void) => {
        const load = () => {
            const primaryPart = model.PrimaryPart;
            if (primaryPart === undefined)
                return;
            const cleanup = callback(primaryPart);
            if (cleanup !== undefined) {
                const connection = primaryPart.AncestryChanged.Connect((_, parent) => {
                    if (parent === undefined) {
                        cleanup();
                        connection.Disconnect();
                    }
                });
            }
        };

        const connection = model.GetPropertyChangedSignal("PrimaryPart").Connect(load);
        load();
        return connection;
    };

    /**
     * Creates a remote event that only fires to players that have streamed in the parent part (and therefore nearby).
     * Note that each model can only have one streamable remote event.
     *
     * @param root Root model to stream the remote event from.
     * @param isUnreliable Whether the remote event should be unreliable.
     * @returns A function that fires the remote event.
     */
    export const createStreamableRemote = (root: Model, isUnreliable?: boolean) => {
        const parent = root.PrimaryPart;
        if (parent === undefined)
            throw "Root must be a model or part with a primary part.";

        const remote = isUnreliable === true ? new UnreliableRemoteEvent() : new RemoteEvent();
        remote.Name = "StreamableRemoteEvent";
        remote.Parent = parent;
        return (...args: unknown[]) => fireNearby(remote, ...args);
    };

    /**
     * Connects a callback to a streamable remote event.
     * 
     * @param root The model containing the streamable remote event.
     * @param callback The function to call when the remote event is fired.
     */
    export const onStreamableRemote = (root: Model, callback: Callback) => {
        onModelStreamIn(root, (primaryPart) => {
            const remote = primaryPart.WaitForChild("StreamableRemoteEvent") as RemoteEvent;
            if (remote === undefined)
                return;
            const connection = remote.OnClientEvent.Connect(callback);
            return () => {
                connection.Disconnect();
            };
        });
    };
}