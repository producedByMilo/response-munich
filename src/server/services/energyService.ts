import { Service, OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";
import { Events } from "server/network";

export const MAX_ENERGY = 100;

@Service()
export class EnergyService implements OnStart {
    private readonly energy = new Map<Player, number>();

    onStart() {
        Players.PlayerAdded.Connect((player) => {
            this.energy.set(player, MAX_ENERGY);
            Events.updateEnergy.fire(player, 1);
        });

        Players.PlayerRemoving.Connect((player) => {
            this.energy.delete(player);
        });

        for (const player of Players.GetPlayers()) {
            this.energy.set(player, MAX_ENERGY);
            Events.updateEnergy.fire(player, 1);
        }
    }

    getEnergy(player: Player) {
        return this.energy.get(player) ?? MAX_ENERGY;
    }

    getEnergyPercent(player: Player) {
        return this.getEnergy(player) / MAX_ENERGY;
    }

    setEnergy(player: Player, value: number) {
        const energy = math.clamp(value, 0, MAX_ENERGY);

        this.energy.set(player, energy);
        Events.updateEnergy.fire(player, energy / MAX_ENERGY);
    }

    addEnergy(player: Player, amount: number) {
        this.setEnergy(player, this.getEnergy(player) + amount);
    }

    removeEnergy(player: Player, amount: number) {
        const currentEnergy = this.getEnergy(player);

        if (currentEnergy < amount) {
            return false;
        }

        this.setEnergy(player, currentEnergy - amount);
        return true;
    }

    hasEnergy(player: Player, amount = 1) {
        return this.getEnergy(player) >= amount;
    }
}