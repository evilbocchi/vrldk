import { Players } from "@rbxts/services";
import { getHumanoidsInArea } from "./BasePartUtils";
import { getNearestHumanoid, getNearbyHumanoids } from "./RigUtils";

/**
 * Returns the character model for a given player.
 * 
 * @param player The player to get the character from.
 * @returns The player's character model or undefined if not available.
 */
export function getCharacter(player?: Player): Model | undefined {
	return player?.Character;
}

/**
 * Gets the Humanoid instance from a player's character.
 * 
 * @param player The player to get the humanoid from.
 * @returns The player's Humanoid instance or undefined if not available.
 */
export function getHumanoid(player?: Player): Humanoid | undefined {
	return getCharacter(player)?.FindFirstChildOfClass("Humanoid");
}

/**
 * Gets the root part (HumanoidRootPart) from a player's humanoid.
 * 
 * @param player The player to get the root part from.
 * @returns The player's root part or undefined if not available.
 */
export function getRootPart(player?: Player): BasePart | undefined {
	return getHumanoid(player)?.RootPart;
}

/**
 * Gets the Animator instance from a player's humanoid.
 * 
 * @param player The player to get the animator from.
 * @returns The player's Animator instance or undefined if not available.
 */
export function getAnimator(player?: Player): Animator | undefined {
	return getHumanoid(player)?.FindFirstChildOfClass("Animator");
}

/**
 * Gets the current health of a player's humanoid.
 * 
 * @param player The player to get the health from.
 * @returns The player's health or 0 if the humanoid is not available.
 */
export function getHealth(player?: Player): number {
	const humanoid = getHumanoid(player);
	return humanoid ? humanoid.Health : 0;
}

/**
 * Checks if a player is dead (health <= 0).
 * 
 * @param player The player to check.
 * @returns True if the player is dead, false otherwise.
 */
export function isDead(player?: Player): boolean {
	return getHealth(player) <= 0;
}

/**
 * Gets all humanoid instances from all players in the game.
 * 
 * @returns An array of all player humanoids.
 */
export function getAllPlayerHumanoids(): Humanoid[] {
	const humanoids: Humanoid[] = [];
	for (const player of Players.GetPlayers()) {
		const humanoid = getHumanoid(player);
		if (humanoid) {
			humanoids.push(humanoid);
		}
	}
	return humanoids;
}

/**
 * Gets the nearest player humanoid to a given position.
 * 
 * @param origin The position to measure distance from.
 * @returns The nearest player humanoid or undefined if none found.
 */
export function getNearestPlayerHumanoid(origin: Vector3): Humanoid | undefined {
	return getNearestHumanoid(getAllPlayerHumanoids(), origin);
}

/**
 * Gets all player humanoids within a specific radius of a position.
 * 
 * @param origin The position to measure distance from.
 * @param radius The maximum distance to include humanoids.
 * @returns An array of player humanoids within the radius.
 */
export function getNearbyPlayerHumanoids(origin: Vector3, radius: number): Humanoid[] {
	return getNearbyHumanoids(getAllPlayerHumanoids(), origin, radius);
}

/**
 * Gets all player humanoids that are touching a specific area (BasePart).
 * 
 * @param area The BasePart defining the area to check.
 * @returns An array of player humanoids in the area.
 */
export function getPlayerHumanoidsInArea(area: BasePart) {
	return getHumanoidsInArea(getAllPlayerHumanoids(), area);
}

/**
 * Checks if all players in the game are dead.
 * 
 * @returns True if all players are dead, false otherwise.
 */
export function isAllPlayersDead(): boolean {
	for (const player of Players.GetPlayers()) {
		if (!isDead(player)) {
			return false;
        }
    }
	return true;
}