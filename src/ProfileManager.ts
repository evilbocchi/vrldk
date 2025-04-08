import Signal from "@antivivi/lemon-signal";
import ProfileService from "@rbxts/profileservice";
import { Profile, ProfileStore } from "@rbxts/profileservice/globals";

/**
 * A class that manages profiles using ProfileService.
 * Handles loading, viewing, unloading, and saving of profiles.
 * 
 * @template T The type of data stored in the profile.
 * @template MetaData The type of metadata stored with the profile.
 */
class ProfileManager<T extends object, MetaData> {

    profileStore: ProfileStore<T, MetaData>;
    name: string;
    template: T;
    loadedProfiles = new Map<string, Profile<T>>();
    viewedProfiles = new Map<string, Profile<T>>();
    awaitingOperations = new Map<string, {type: "load" | "view", signal: Signal<Profile<T>>}>();

    /**
     * Creates a new profile manager.
     * 
     * @param name The name of the profile store.
     * @param template The template object for the profile.
     */
    constructor(name: string, template: T) {
        this.profileStore = ProfileService.GetProfileStore(name, template);
        this.name = name;
        this.template = template;
    }

    /**
     * Loads a profile with the given key, with retry capability.
     * 
     * @param profileKey The key of the profile to load.
     * @param retryTime Optional retry delay in seconds if loading fails.
     * @returns The loaded profile.
     */
    load(profileKey: string, retryTime?: number): Profile<T> {
        const t = tick();
        const cached = this.loadedProfiles.get(profileKey);
        if (cached !== undefined) {
            return cached;
        }
        const profile = this.profileStore.LoadProfileAsync(profileKey);
        if (profile === undefined) {
            if (retryTime === undefined) {
                retryTime = 0.1;
            }
            else {
                retryTime *= 2;
            }
            if (retryTime > 0.5) {
                warn("Could not load profile " + profileKey + ". Retrying in " + retryTime + "s");
            }
            task.wait(retryTime);
            return this.load(profileKey, retryTime);
        }
        else {
            this.loadedProfiles.set(profileKey, profile);
        }
        const delta = tick() - t;
        const message = "Loaded profile " + profileKey + " in " + math.floor(delta * 100) / 100 + "s";
        profile.Reconcile();
        if (delta > 5) {
            warn(message);
        }
        else {
            print(message);
        }
        return profile;
    }

    /**
     * Views a profile without loading it fully.
     * 
     * @param profileKey The key of the profile to view.
     * @returns The viewed profile or undefined if not found.
     */
    view(profileKey: string) {
        const t = tick();
        const cached = this.loadedProfiles.get(profileKey);
        if (cached !== undefined) {
            return cached;
        }
        const viewCached = this.viewedProfiles.get(profileKey);
        if (viewCached !== undefined) {
            return viewCached;
        }
        const inProgress = this.awaitingOperations.get(profileKey);
        if (inProgress !== undefined) {
            const [res] = inProgress.signal.wait();
            return res;
        }
        const signal = new Signal<Profile<T>>();
        const awaitingOperation = {type: "view", signal: signal} as const;
        this.awaitingOperations.set(profileKey, awaitingOperation);
        const profile = this.profileStore.ViewProfileAsync(profileKey);
        if (profile !== undefined) {
            signal.fire(profile);
            this.awaitingOperations.delete(profileKey);
            this.viewedProfiles.set(profileKey, profile);
        }
        const delta = tick() - t;
        const message = "Viewed profile " + profileKey + " in " + math.floor(delta * 100) / 100 + "s";
        if (delta > 5) {
            warn(message);
        }
        else {
            print(message);
        }
        return profile;
    }

    /**
     * Releases and unloads a profile from memory.
     * 
     * @param profileKey The key of the profile to unload.
     * @returns True if the profile was unloaded, false otherwise.
     */
    unload(profileKey: string) {
        const profile = this.loadedProfiles.get(profileKey);
        if (profile !== undefined) {
            profile.Release();
        }
        const success = this.loadedProfiles.delete(profileKey);
        if (success) {
            print("Unloaded profile " + profileKey);
        }
        else {
            warn("Could not unload profile " + profileKey);
        }
        return success;
    }

    /**
     * Saves a profile to the DataStore.
     * 
     * @param profileKey The key of the profile to save.
     * @returns True if the profile was saved, false if not found.
     */
    save(profileKey: string) {
        const profile = this.loadedProfiles.get(profileKey);
        if (profile !== undefined) {
            profile.Save();
            return true;
        }
        return false;
    }
}

export = ProfileManager;