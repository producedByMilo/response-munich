import { Component, BaseComponent } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { RunService } from "@rbxts/services";
import { getSound } from "shared/modules/sound";

interface Attributes {
    HoldAnimation?: number;
    EquipSound?: string;
    Tip?: string;
}

@Component({
    tag: "basicTool",
})
export class BasicTool extends BaseComponent<Attributes> implements OnStart {
    onStart(): void {
        if (RunService.IsClient()) {
            this.runClient();
        }
    }

    private runClient(): void {
        const equipSound = this.attributes.EquipSound;
        if (!equipSound) return;

        const sound = getSound(equipSound);
        if (!sound || !this.instance.IsA("Tool")) return;

        sound.Parent = this.instance;

        this.instance.Equipped.Connect(() => {
            sound.Play();
        });
    }
}