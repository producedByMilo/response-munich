import { createProducer } from "@rbxts/reflex";

export interface PlayerData {
    player: Player;
}

export const players = createProducer(
    [] as PlayerData[],
    {
        addPlayer: (state: PlayerData[], player: PlayerData) => {
            return [...state, player];
        },

        removePlayer: (state: PlayerData[], player: Player) => {
            return state.filter((data: PlayerData) => data.player !== player);
        },
    },
);