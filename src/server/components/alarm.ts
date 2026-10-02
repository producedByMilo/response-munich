import { BaseComponent, Component } from "@flamework/components";
import { Flamework } from "@flamework/core";

@Component({
    tag: "alarm",
    instanceGuard: Flamework.createGuard<BasePart>(),
})
export class AlarmComponent extends BaseComponent {
    activateAlarm(duration: number): void {
        const instance = this.instance;


    }
}