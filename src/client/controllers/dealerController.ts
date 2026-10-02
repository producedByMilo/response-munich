import { Controller, OnStart } from "@flamework/core";
import { Events } from "client/scripts/network";
import { Players } from "@rbxts/services";
import { toggleDealerUI } from "shared/utils/dealerUtil";

@Controller()
export class DealerController implements OnStart {
    onStart(): void {
        const player = Players.LocalPlayer;
        const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;
        const dealer = playerGui.WaitForChild("App")?.WaitForChild("dealer") as Frame;
        const closeButton = dealer?.WaitForChild("3") as ImageButton;
        closeButton?.Activated.Connect(() => {
            toggleDealerUI(player, false);
        });
        Events.sendDealer.connect(() => {
            toggleDealerUI(player, true);
        });
    }
}