/**
 * Loads an animation onto a humanoid or animation controller.
 *
 * @param controller The humanoid or animation controller to load the animation onto.
 * @param animationId The ID of the animation to load, either as a string or number.
 * @returns The loaded animation track or undefined if loading fails.
 */
export function loadAnimation(
	controller: Humanoid | AnimationController,
	animationId: string | number,
): AnimationTrack | undefined {
	const animation = new Animation();
	const id = typeOf(animationId) === "number" ? "rbxassetid://" + animationId : (animationId as string);
	animation.AnimationId = id;
	return controller.FindFirstChildOfClass("Animator")?.LoadAnimation(animation);
}

/**
 * Stops and destroys all animations currently playing on a humanoid.
 *
 * @param humanoid The humanoid to stop animations on.
 */
export function stopAllAnimations(humanoid: Humanoid) {
	const animator = humanoid.FindFirstChildOfClass("Animator");
	if (animator) {
		for (const track of animator.GetPlayingAnimationTracks()) {
			track.Stop();
			track.Destroy();
		}
	}
}

/**
 * Finds the humanoid closest to a given position from an array of humanoids.
 *
 * @param humanoids The array of humanoids to search through.
 * @param origin The position to measure distance from.
 * @returns The nearest humanoid or undefined if none found.
 */
export function getNearestHumanoid(humanoids: Humanoid[], origin: Vector3): Humanoid | undefined {
	let nearestDist = 999;
	let nearestHumanoid = undefined as Humanoid | undefined;
	for (const humanoid of humanoids) {
		if (humanoid.RootPart) {
			const dist = humanoid.RootPart.Position.sub(origin).Magnitude;
			if (dist < nearestDist) {
				nearestDist = dist;
				nearestHumanoid = humanoid;
			}
		}
	}
	return nearestHumanoid;
}

/**
 * Gets all humanoids within a specific radius of a position.
 *
 * @param humanoids The array of humanoids to search through.
 * @param origin The position to measure distance from.
 * @param radius The maximum distance to include humanoids.
 * @returns An array of humanoids within the radius.
 */
export function getNearbyHumanoids(humanoids: Humanoid[], origin: Vector3, radius: number): Humanoid[] {
	/*
    const check = new Part();
    check.Shape = Enum.PartType.Ball;
    check.Position = origin;
    check.Size = new Vector3(radius * 2, radius * 2, radius * 2);
    check.Transparency = 0.5;
    check.Anchored = true;
    check.CanCollide = false;
    check.Parent = Workspace;
    Debris.AddItem(check, 1);
    */
	const nearby: Humanoid[] = [];
	for (const humanoid of humanoids) {
		if (humanoid.RootPart && humanoid.RootPart.Position.sub(origin).Magnitude <= radius) {
			nearby.push(humanoid);
		}
	}
	return nearby;
}
