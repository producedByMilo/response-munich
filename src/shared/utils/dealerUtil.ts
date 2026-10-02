import { togglePlayerUI } from "./playerUtil";

export function toggleDealerUI(player: Player, status: boolean): void {
    const playerGui = player.FindFirstChildOfClass("PlayerGui") as PlayerGui;
    const app = playerGui.FindFirstChild("App") as ScreenGui;
    const dealer = app.FindFirstChild("dealer") as Frame;
    if (dealer) {
        dealer.Visible = status;
        if (status === true) {
            togglePlayerUI(player, true);
        } else {
            togglePlayerUI(player, false);
        }
    }
}