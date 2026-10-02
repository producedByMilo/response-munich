import { Config, Id } from "./types";

export const CRIMES: Record<Id, Config> = {
    shop_robbery: {
        id: "shop_robbery",
        displayName: "Shop Robbery",

        wantedLevel: 1,

        duration: 10,
        cooldown: 300,
    },

    atm_robbery: {
        id: "atm_robbery",
        displayName: "ATM Robbery",

        wantedLevel: 2,

        duration: 15,
        cooldown: 500,
    },

    bank_robbery: {
        id: "bank_robbery",
        displayName: "Bank Robbery",

        wantedLevel: 5,

        duration: 60,
        cooldown: 900,
    },

    juweler_robbery: {
        id: "juweler_robbery",
        displayName: "Juweler Robbery",

        wantedLevel: 2,

        duration: 30,
        cooldown: 500,
    }
};

export function getCrimeConfig(crimeId: Id): Config {
    return CRIMES[crimeId];
}