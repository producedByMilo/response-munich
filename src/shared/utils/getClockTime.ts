import { Workspace } from "@rbxts/services";
import { DayNightCycleTime, DayNightCycleOffset } from "shared/constants";

export function getClockTime(): number {
    const cycleLength = DayNightCycleTime;
    const offset = DayNightCycleOffset;

    const elapsed = (Workspace.GetServerTimeNow() + offset) % cycleLength;

    return (elapsed / cycleLength) * 24;
}