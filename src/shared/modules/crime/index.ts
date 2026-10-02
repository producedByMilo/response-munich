import { Players } from "@rbxts/services";

export function isPlayerAlive(player: Player): boolean {
    const character = player.Character;
    if (!character) return false;

    const humanoid = character.FindFirstChildOfClass("Humanoid");
    if (!humanoid) return false;

    return humanoid.Health > 0;
}

export function getPlayerRootPart(player: Player): BasePart | undefined {
    const character = player.Character;
    if (!character) return undefined;

    const rootPart = character.FindFirstChild("HumanoidRootPart");

    if (!rootPart || !rootPart.IsA("BasePart")) {
        return undefined;
    }

    return rootPart;
}

export function getPlayers(): Player[] {
    return Players.GetPlayers();
}