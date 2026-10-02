import { Service } from "@flamework/core";
import { Items } from "shared/modules/items"
import { ServerStorage } from "@rbxts/services";

@Service()
export class InventoryService {
    addItem(player: Player, itemId: string): void {
        const item = Items.getItemById(itemId);
        if (!item) return;

        const itemFolder = ServerStorage.FindFirstChild("Items")?.FindFirstChild(item.Category) as Folder;
        if (!itemFolder) return;

        const tool = itemFolder.FindFirstChild(item.Id) as Tool;
        const clonedTool = tool.Clone();
        clonedTool.Parent = player.FindFirstChild("Backpack");

        print(`${player.Name} received ${item.Name}`);
    }
}