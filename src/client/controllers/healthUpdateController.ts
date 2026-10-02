import { Players } from "@rbxts/services";
import { Controller, OnTick } from "@flamework/core";

@Controller()
export class HealthUpdateController implements OnTick {
    private readonly player = Players.LocalPlayer;

    onTick(dt: number): void {
        const character = this.player.Character;
        if (!character) return;

        const humanoid = character.FindFirstChildOfClass("Humanoid");
        if (!humanoid) return;

        if (humanoid.Health > 0 && humanoid.Health < 5 || humanoid.Health === 5) {
            humanoid.Health = 0;
            return;
        }

        if (humanoid.Health > 0 && humanoid.Health < 80) {
            humanoid.Health = math.min(humanoid.Health + 0.5 * dt, 80);
        }
    }
}