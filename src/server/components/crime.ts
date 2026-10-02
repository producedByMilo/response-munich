import { Component, BaseComponent } from "@flamework/components";
import { OnStart } from "@flamework/core";

import { Id } from "shared/modules/crime/types";
import { CrimeService } from "server/services/crimeService";

interface Attributes {
    Name: string;
    CrimeId: Id;
}

@Component({
    tag: "crime",
})
export class CrimeComponent extends BaseComponent<Attributes> implements OnStart {
    private prompt?: ProximityPrompt;

    constructor(
        private readonly crimeService: CrimeService,
    ) {
        super();
    }

    onStart(): void {
        this.createPrompt();
    }

    private createPrompt(): void {
        const prompt = new Instance("ProximityPrompt");

        prompt.Name = "Crime";
        prompt.ActionText = "Rob";
        prompt.ObjectText = this.attributes.Name;
        prompt.KeyboardKeyCode = Enum.KeyCode.E;
        prompt.HoldDuration = this.getHoldDuration();
        prompt.MaxActivationDistance = 7;
        prompt.RequiresLineOfSight = false;

        prompt.Parent = this.instance;

        prompt.Triggered.Connect((player) => {
            this.handleTriggered(player);
        });

        this.prompt = prompt;
    }

    private handleTriggered(player: Player): void {
        const crimeId = this.attributes.CrimeId;

        if (!crimeId) {
            warn(`CrimeComponent is missing Id: ${this.instance.GetFullName()}`);
            return;
        }

        this.crimeService.startCrime(player, crimeId, this.instance);
    }

    private getHoldDuration(): number {
        const crimeId = this.attributes.CrimeId;

        if (crimeId === "bank_robbery") {
            return 5;
        }

        if (crimeId === "atm_robbery") {
            return 3;
        }

        if (crimeId === "juweler_robbery") {
            return 2;
        }

        return 3;
    }
}