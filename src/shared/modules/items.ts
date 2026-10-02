type Category = "Loot" | "Weapon" | "Consumeable" | "Util";

interface Item {
    Id: string;
    Name: string;
    Price: number;
    SellPrice: number;
    Image: number;
    Category: Category;
    Refillable: boolean;
    RefillPrice: number;
    Buyable: boolean;
    BuyStackLimit: number;
    IsDropable: boolean;
}

export namespace Items {
    const ItemRegistry = new Map<string, Item>();

    export const Jewel_Tool: Item = {
        Id: "Jewels",
        Name: "Jewels",
        Price: 0,
        SellPrice: 500,
        Image: 0,
        Category: "Loot",
        Refillable: false,
        RefillPrice: 0,
        Buyable: false,
        BuyStackLimit: -1,
        IsDropable: true,
    };

    ItemRegistry.set(Jewel_Tool.Id, Jewel_Tool);

    export function getItemById(itemId: string): Item | undefined {
        return ItemRegistry.get(itemId);
    }
}