//!native
//!optimize 2
import { Debris, Players, TweenService, Workspace } from "@rbxts/services";

/**
 * Creates a weld between two parts.
 * Note that this weld does not automatically unanchor the parts.
 * 
 * @param part0 The first part to weld.
 * @param part1 The second part to weld.
 * @returns The created weld instance.
 */
export function weld(part0: BasePart, part1: BasePart) {
    const w = new Instance("ManualWeld", part0);
    w.Name = part0.Name + "_Weld_" + part1.Name;
    w.C0 = part0.CFrame.Inverse().mul(part1.CFrame);
    w.Part0 = part0;
    w.Part1 = part1;
    return w;
}

/**
 * Creates a weld between parts and a primary part, unanchoring all parts except the primary part.
 * 
 * @param parts The parts to weld.
 * @param primary The primary part to weld to.
 */
export function weldParts(parts: Instance[], primary: BasePart) {
    for (const part of parts) {
        if (part.IsA("BasePart") && part !== primary) {
            const weld = new WeldConstraint();
            weld.Enabled = true;
            weld.Part0 = part;
            weld.Part1 = primary;
            weld.Parent = part;
            part.Anchored = false;
        }
    }
}

/**
 * Welds a model to its primary part and returns the primary part.
 * 
 * @param model The model to weld.
 * @returns The primary part of the model.
 */
export function weldModel(model: Model) {
    if (model.PrimaryPart !== undefined) {
        weldParts(model.GetDescendants(), model.PrimaryPart);
        return model.PrimaryPart;
    }
    else {
        throw "No PrimaryPart found for model " + model.Name;
    }
}

const colors = [
    new Color3(1, 0, 0),
    new Color3(1, 1, 0),
    new Color3(0, 1, 0),
    new Color3(0, 1, 1),
    new Color3(0, 0, 1),
    new Color3(1, 0, 1)
];
/**
 * Creates a rainbow effect on the given part by cycling through a list of colors.
 * 
 * @param basePart The part to apply the rainbow effect to.
 * @param dur The duration of each color transition in seconds.
 * @returns A function to stop the rainbow effect.
 */
export function rainbowEffect(basePart: BasePart, dur: number) {
    const tweens = colors.map(color => TweenService.Create(basePart, new TweenInfo(dur), { Color: color }));
    let currentIndex = 0;

    const playNextTween = () => {
        if (basePart !== undefined && basePart.Parent !== undefined)
            tweens[currentIndex].Play();
        else
            endRainbow();
    };

    const size = tweens.size();
    const connections = tweens.map((tween, index) => {
        return tween.Completed.Connect(() => {
            currentIndex = (index + 1) % size;
            playNextTween();
        });
    });

    const endRainbow = () => {
        connections.forEach(connection => connection.Disconnect());
    };

    playNextTween();
    return endRainbow;
}

/**
 * Reverts the surfaces of a part to their default values.
 * 
 * @param part The part to revert the surfaces of.
 */
export function revertSurfaces(part: Part) {
    part.TopSurface = Enum.SurfaceType.Studs;
    part.BottomSurface = Enum.SurfaceType.Studs;
    part.LeftSurface = Enum.SurfaceType.Studs;
    part.RightSurface = Enum.SurfaceType.Studs;
    part.FrontSurface = Enum.SurfaceType.Studs;
    part.BackSurface = Enum.SurfaceType.Studs;
}

/**
 * Checks if a position is inside a volume defined by a center and size.
 * 
 * @param position The position to check.
 * @param volumeCenter The center of the volume.
 * @param volumeSize The size of the volume.
 * @returns True if the position is inside the volume, false otherwise.
 */
export function isInside(position: Vector3, volumeCenter: CFrame, volumeSize: Vector3) {
    const v3 = volumeCenter.PointToObjectSpace(position);
    return (math.abs(v3.X) <= volumeSize.X / 2) && (math.abs(v3.Y) <= volumeSize.Y / 2) && (math.abs(v3.Z) <= volumeSize.Z / 2);
}

/**
 * Checks if a position is inside a part.
 * 
 * @param position The position to check.
 * @param part The part to check against.
 * @returns True if the position is inside the part, false otherwise.
 */
export function isInsidePart(position: Vector3, part?: BasePart) {
    if (part === undefined)
        return false;
    return isInside(position, part.CFrame, part.Size);
}

/**
 * Checks if a CFrame and size are completely inside a part.
 * 
 * @param cframe The CFrame to check.
 * @param size The size to check against.
 * @param part The part to check against.
 * @returns True if the CFrame and size are completely inside the part, false otherwise.
 */
export function isCompletelyInside(cframe: CFrame, size: Vector3, part?: BasePart) {
    size = size.div(2);
    const corners = [
        cframe.mul(new CFrame(size.X, size.Y, size.Z)),
        cframe.mul(new CFrame(size.X, size.Y, -size.Z)),
        cframe.mul(new CFrame(size.X, -size.Y, size.Z)),
        cframe.mul(new CFrame(size.X, -size.Y, -size.Z)),
        cframe.mul(new CFrame(-size.X, size.Y, size.Z)),
        cframe.mul(new CFrame(-size.X, size.Y, -size.Z)),
        cframe.mul(new CFrame(-size.X, -size.Y, size.Z)),
        cframe.mul(new CFrame(-size.X, -size.Y, -size.Z))
    ];
    for (const cf of corners) {
        if (!isInsidePart(cf.Position, part))
            return false;
    }
    return true;
}

/**
 * Finds all BaseParts with a specific name in the given instance and its descendants.
 * 
 * @param instance The instance to search in.
 * @param name The name of the BaseParts to find.
 * @returns An array of BaseParts with the specified name.
 */
export function findBaseParts(instance: Instance, name: string): BasePart[] {
    return instance.GetDescendants().filter((v) => v.Name === name && v.IsA("BasePart")) as BasePart[];
}

/**
 * Plays a sound at the given part's position.
 * 
 * @param basePart The part to play the sound at.
 * @param sound The sound to play, either as an Instance or a string/number representing the SoundId.
 * @param volume The volume of the sound.
 */
export function playSoundAtPart(basePart: Instance | undefined, sound: Sound | string | number, volume?: number) {
    let soundInstance: Sound;
    if (typeOf(sound) === "Instance") {
        soundInstance = (sound as Sound).Clone();
    }
    else {
        soundInstance = new Sound();
        soundInstance.SoundId = typeOf(sound) === "string" ? sound as string : "rbxassetid://" + tostring(sound);
    }
    if (volume !== undefined) {
        soundInstance.Volume = volume;
    }
    soundInstance.Parent = basePart;
    soundInstance.Ended.Once(() => Debris.AddItem(soundInstance, 0.05));
    soundInstance.Stopped.Once(() => Debris.AddItem(soundInstance, 0.05));
    soundInstance.Play();
}

/**
 * Adds a TouchInterest to a BasePart and sets its CanTouch property to true.
 * 
 * @param basePart The BasePart to add the TouchInterest to.
 * @returns The TouchTransmitter instance if it was created, otherwise undefined.
 */
export function addTouchInterest(basePart: BasePart): TouchTransmitter | undefined {
    basePart.CanTouch = true;
    basePart.Touched.Connect(() => { });
    return basePart.FindFirstChildOfClass("TouchTransmitter");
}

/**
 * Gets all Humanoids in the area defined by the given BasePart.
 * 
 * @param humanoids The array of Humanoids to check against.
 * @param area The BasePart defining the area.
 * @returns An array of Humanoids in the area.
 */
export function getHumanoidsInArea(humanoids: Humanoid[], area: BasePart) {
    area.Touched.Connect(() => { });
    const inArea: Humanoid[] = [];
    for (const otherPart of area.GetTouchingParts()) {
        if (otherPart.Parent) {
            const humanoid = otherPart.Parent.FindFirstChildOfClass("Humanoid");
            if (humanoid && humanoids.includes(humanoid)) {
                inArea.push(humanoid);
            }
        }
    }
    return inArea;
}

/**
 * Returns the player associated with the given part, if any.
 * 
 * @param part The part to get the player from.
 * @returns The player associated with the part, if any.
 */
export function getPlayer(part: BasePart) {
    if (part.Name !== "HumanoidRootPart")
        return;
    const character = part.Parent;
    if (character === undefined)
        return;
    const player = Players.GetPlayerFromCharacter(character);
    if (player === undefined) {
        return;
    }
    return player;
}

/**
 * Spawns an explosion at the given position.
 * 
 * @param position The position to spawn the explosion at.
 * @param part An optional part to parent the explosion to.
 */
export function spawnExplosion(position: Vector3, part?: BasePart) {
    if (part === undefined) {
        part = new Part();
        part.Transparency = 1;
        part.Anchored = true;
        part.CanCollide = false;
        part.Position = position;
        part.Parent = Workspace;
    }
    const explosion = new Explosion();
    explosion.DestroyJointRadiusPercent = 0;
    explosion.ExplosionType = Enum.ExplosionType.NoCraters;
    explosion.Position = position;
    explosion.BlastRadius = 0;
    explosion.Parent = part;
    Debris.AddItem(part, 4);
}

