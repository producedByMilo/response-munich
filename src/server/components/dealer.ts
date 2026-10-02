import { Component, BaseComponent } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { Events } from "server/network";

@Component({ tag: "Dealer" })
export class DealerComponent extends BaseComponent implements OnStart {
    onStart(): void {
        this.createPrompt(this.instance);
    }

    private createPrompt(instance: Instance): void {
        const humanoidRootPart = instance.FindFirstChild("HumanoidRootPart");
        if (!humanoidRootPart) return;

        const prompt = new Instance("ProximityPrompt");
        prompt.ActionText = "Open";
        prompt.ObjectText = "Dealer";
        prompt.RequiresLineOfSight = false;
        prompt.MaxActivationDistance = 7;
        prompt.Parent = humanoidRootPart;

        prompt.Triggered.Connect((player) => {
            Events.sendDealer.fire(player);
        });
    }
}