import { Controller, OnStart } from "@flamework/core";
import { ContextActionService } from "@rbxts/services";
import { SetEnergy } from "shared/modules/energyState";
import { Events } from "client/scripts/network";

@Controller()
export class EnergyController implements OnStart {
    onStart() {
        Events.updateEnergy.connect((energy) => {
            SetEnergy(energy);
        });

        ContextActionService.BindAction(
            "Sprint",
            (_, inputState) => {
                if (inputState === Enum.UserInputState.Begin) {
                    Events.setSprinting.fire(true);
                } else if (inputState === Enum.UserInputState.End || inputState === Enum.UserInputState.Cancel) {
                    Events.setSprinting.fire(false);
                }

                return Enum.ContextActionResult.Pass;
            },
            false,
            Enum.KeyCode.LeftShift,
            Enum.KeyCode.RightShift,
        );
    }
}