import { toggleCamera } from "./toggleCamera";
export function togglePlayerUI(player: Player, bool: boolean): void {
    const humanoid = player.Character?.FindFirstChildOfClass("Humanoid") as Humanoid;
    if (humanoid && bool === true) {
        humanoid.WalkSpeed = 0;
        humanoid.JumpPower = 0;
        humanoid.AutoRotate = false;
        toggleCamera(true);
    } else {
        humanoid.WalkSpeed = 12;
        humanoid.JumpPower = 50;
        humanoid.AutoRotate = true;
        toggleCamera(false);
    }
}