import { OnStart, OnTick, Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import { EnergyService, MAX_ENERGY } from "./energyService";

const REGENERATION_DELAY = 1;
const REGENERATION_PER_SECOND = 15;

@Service()
export class EnergyRegenerationService implements OnStart, OnTick {
    private readonly lastEnergyUsage = new Map<Player, number>();

    constructor(private readonly energyService: EnergyService) { }

    onStart() {
        Players.PlayerAdded.Connect((player) => {
            this.lastEnergyUsage.set(player, 0);
        });

        Players.PlayerRemoving.Connect((player) => {
            this.lastEnergyUsage.delete(player);
        });

        for (const player of Players.GetPlayers()) {
            this.lastEnergyUsage.set(player, 0);
        }
    }

    onTick(deltaTime: number) {
        const currentTime = os.clock();

        for (const player of Players.GetPlayers()) {
            const lastUsage = this.lastEnergyUsage.get(player) ?? 0;

            if (currentTime - lastUsage < REGENERATION_DELAY) {
                continue;
            }

            if (this.energyService.getEnergy(player) >= MAX_ENERGY) {
                continue;
            }

            this.energyService.addEnergy(player, REGENERATION_PER_SECOND * deltaTime);
        }
    }

    markEnergyUsed(player: Player) {
        this.lastEnergyUsage.set(player, os.clock());
    }
}