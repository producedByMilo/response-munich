import { Controller, OnTick } from "@flamework/core";
import { Lighting } from "@rbxts/services";
import { getClockTime } from "shared/utils/getClockTime";

@Controller()
export class CycleController implements OnTick {
    onTick(): void {
        Lighting.ClockTime = getClockTime();
    }
}