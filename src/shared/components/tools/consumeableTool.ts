import { Component, BaseComponent } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { RunService } from "@rbxts/services";
import { getSound } from "shared/modules/sound";

interface Attributes {
    HoldAnimation?: number,
    EquipSound?: string,
    ConsumeAnimation?: number,
    ConsumeSound?: number,
    ConsumeHealth?: number,
    ConsumeEnergy?: number,
    ConsumeTime?: number,
    Tip?: string
}

@Component({
    tag: "consumeableTool"
})
export class ConsumeableTool extends BaseComponent<Attributes> implements OnStart {
    onStart(): void {
        if (RunService.IsServer()) {
            this.runServer();
        } else {
            this.runClient();
        }
    }

    private runServer(): void { }

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