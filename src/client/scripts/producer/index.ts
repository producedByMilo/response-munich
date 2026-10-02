import { combineProducers } from "@rbxts/reflex";

import { players } from "./player";
import { playerData } from "./playerData";

export const producer = combineProducers({
    players,
    playerData
});