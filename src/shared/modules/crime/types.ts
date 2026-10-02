export type Id = "shop_robbery" | "atm_robbery" | "bank_robbery" | "juweler_robbery";

export interface Config {
    id: Id;
    displayName: string;

    wantedLevel: number;

    duration: number;
    cooldown: number;
}