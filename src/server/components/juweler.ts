import { Component, BaseComponent } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { InventoryService } from "../services/inventoryService";
import { WantedService } from "server/services/wantedService";

interface Attributes {
    items: string;
    duration: number;
    respawnTime: number;
}

@Component({
    tag: "juweler_robbery",
})
export class JuwelerComponent extends BaseComponent<Attributes, Model> implements OnStart {
    private glass?: BasePart;
    private breakPrompt?: ProximityPrompt;

    private itemPrompts = new Map<BasePart, ProximityPrompt>();
    private takenItems = new Set<BasePart>();

    private isBroken = false;

    private readonly glassTemplate?: BasePart;

    constructor(
        private readonly inventoryService: InventoryService,
        private readonly wantedService: WantedService,
    ) {
        super();

        const glass = this.instance.FindFirstChild("Glass");

        if (glass && glass.IsA("BasePart")) {
            this.glass = glass;
            this.glassTemplate = glass.Clone() as BasePart;
        }
    }

    onStart(): void {
        this.createBreakPrompt();
        this.createItemPrompts();
    }

    private createBreakPrompt(): void {
        if (!this.glass) {
            warn(`Glass not found in ${this.instance.GetFullName()}`);
            return;
        }

        const prompt = new Instance("ProximityPrompt");

        prompt.Name = "Break";
        prompt.ActionText = "Break";
        prompt.ObjectText = "Glass";
        prompt.KeyboardKeyCode = Enum.KeyCode.E;
        prompt.HoldDuration = this.attributes.duration ?? 2;
        prompt.MaxActivationDistance = 8;
        prompt.RequiresLineOfSight = false;
        prompt.Exclusivity = Enum.ProximityPromptExclusivity.OnePerButton;
        prompt.Parent = this.glass;

        prompt.Triggered.Connect((player) => {
            this.rob(player);
        });

        this.breakPrompt = prompt;
    }

    private createItemPrompts(): void {
        for (const child of this.instance.GetChildren()) {
            if (!child.IsA("BasePart")) {
                continue;
            }

            if (child.Name === "Glass") {
                continue;
            }

            if (!this.isItem(child)) {
                continue;
            }

            this.createItemPrompt(child);
        }
    }

    private createItemPrompt(item: BasePart): void {
        const prompt = new Instance("ProximityPrompt");

        prompt.Name = "Take";
        prompt.ActionText = "Take";
        prompt.ObjectText = item.Name;
        prompt.KeyboardKeyCode = Enum.KeyCode.E;
        prompt.HoldDuration = 3;
        prompt.MaxActivationDistance = 6;
        prompt.RequiresLineOfSight = false;
        prompt.Exclusivity = Enum.ProximityPromptExclusivity.OnePerButton;
        prompt.Enabled = false;
        prompt.Parent = item;

        prompt.Triggered.Connect((player) => {
            this.takeItem(player, item);
        });

        this.itemPrompts.set(item, prompt);
    }

    private rob(player: Player): void {
        if (this.isBroken) {
            return;
        }

        if (!player.Character) {
            return;
        }

        this.isBroken = true;

        if (this.breakPrompt) {
            this.breakPrompt.Enabled = false;
        }

        this.breakGlass();
        this.enableItemPrompts();

        this.wantedService.addStar(player, 2);
        print(`${player.Name} broke into ${this.instance.GetFullName()}`);
    }

    private takeItem(player: Player, item: BasePart): void {
        if (!this.isBroken) {
            return;
        }

        if (this.takenItems.has(item)) {
            return;
        }

        if (!item.Parent) {
            return;
        }

        this.takenItems.add(item);

        const itemId = item.Name;
        print(`${player.Name} took ${itemId}`);

        this.inventoryService.addItem(player, itemId);

        const prompt = this.itemPrompts.get(item);

        if (prompt) {
            prompt.Enabled = false;
        }

        item.Destroy();
        this.checkAllItemsTaken();
    }

    private checkAllItemsTaken(): void {
        const items = this.getItems();

        if (items.size() === 0) {
            return;
        }

        for (const item of items) {
            if (!this.takenItems.has(item)) {
                return;
            }
        }

        this.startRespawn();
    }

    private startRespawn(): void {
        task.delay(this.attributes.respawnTime, () => {
            this.restore();
        });
    }

    private breakGlass(): void {
        if (!this.glass) {
            return;
        }

        this.glass.Destroy();
        this.glass = undefined;
    }

    private enableItemPrompts(): void {
        for (const [item, prompt] of this.itemPrompts) {
            if (item.Parent) {
                prompt.Enabled = true;
            }
        }
    }

    private restore(): void {
        if (!this.instance.Parent) {
            return;
        }

        this.restoreGlass();
        this.restoreItems();

        this.takenItems.clear();
        this.isBroken = false;

        if (this.breakPrompt) {
            this.breakPrompt.Enabled = true;
        }
    }

    private restoreGlass(): void {
        if (!this.glassTemplate) {
            return;
        }

        if (this.glass && this.glass.Parent) {
            return;
        }

        const glass = this.glassTemplate.Clone();

        glass.Parent = this.instance;
        this.glass = glass;

        this.createBreakPrompt();
    }

    private restoreItems(): void {
        for (const item of this.getItems()) {
            item.Transparency = 0;
            item.CanCollide = true;
            item.CanTouch = true;
            item.CanQuery = true;

            const prompt = this.itemPrompts.get(item);

            if (prompt) {
                prompt.Enabled = false;
            }
        }
    }

    private getItems(): BasePart[] {
        return this.instance
            .GetChildren()
            .filter((child) => {
                return child.IsA("BasePart") && this.isItem(child);
            }) as BasePart[];
    }

    private isItem(part: BasePart): boolean {
        return part.Name !== "Glass";
    }
}