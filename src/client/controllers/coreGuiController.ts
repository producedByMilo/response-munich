import { Controller, OnStart } from "@flamework/core";
import { StarterGui } from "@rbxts/services"

@Controller()
export class CoreGuiController implements OnStart {
	onStart(): void {
		pcall(() => {
			StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Health, false);
			StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.PlayerList, false);
		});
		pcall(() => {
			StarterGui.SetCore("ResetButtonCallback", false);
		});
	}
}