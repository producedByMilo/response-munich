import { createProducer } from "@rbxts/reflex";

export interface PlayerData {
    money: number;
    vehicles: never[];
    wantedLevel: number;
    health: number;
}

export const DEFAULT_PLAYER_DATA: PlayerData = {
    money: 8000,
    vehicles: [],
    wantedLevel: 0,
    health: 100,
};

type PlayerDataState = Record<number, PlayerData>;

export const playerData = createProducer(
    {} as PlayerDataState,
    {
        addPlayer: (state: PlayerDataState, player: Player, data: PlayerData) => {
            return {
                ...state,
                [player.UserId]: data,
            };
        },

        removePlayer: (state: PlayerDataState, player: Player) => {
            const newState = { ...state };
            delete newState[player.UserId];

            return newState;
        },

        setData: (
            state: PlayerDataState,
            player: Player,
            data: PlayerData,
        ) => {
            return {
                ...state,
                [player.UserId]: data,
            };
        },

        setValue: <K extends keyof PlayerData>(
            state: PlayerDataState,
            player: Player,
            key: K,
            value: PlayerData[K],
        ) => {
            const currentData = state[player.UserId];

            if (!currentData) {
                return state;
            }

            return {
                ...state,
                [player.UserId]: {
                    ...currentData,
                    [key]: value,
                },
            };
        },

        incrementValue: (
            state: PlayerDataState,
            player: Player,
            key: keyof PlayerData,
            amount: number,
        ) => {
            const currentData = state[player.UserId];

            if (!currentData) {
                return state;
            }

            const currentValue = currentData[key];

            if (typeIs(currentValue, "number")) {
                return {
                    ...state,
                    [player.UserId]: {
                        ...currentData,
                        [key]: currentValue + amount,
                    },
                };
            }

            return state;
        },
    },
);