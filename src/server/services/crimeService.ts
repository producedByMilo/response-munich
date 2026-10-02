import { OnStart, Service } from "@flamework/core";
import { Players, RunService } from "@rbxts/services";

import { Config, Id } from "../../shared/modules/crime/types";
import { getCrimeConfig } from "../../shared/modules/crime/config";
import { isPlayerAlive } from "../../shared/modules/crime";

import { PlayerDataService } from "./playerDataService";
import { WantedService } from "./wantedService";

interface ActiveCrime {
    player: Player;
    crimeId: Id;

    instance: Instance;

    startTime: number;
    endTime: number;
}

@Service()
export class CrimeService implements OnStart {
    private readonly activeCrimes = new Map<Player, ActiveCrime>();
    private readonly cooldowns = new Map<Instance, number>();

    constructor(
        private readonly playerDataService: PlayerDataService,
        private readonly wantedService: WantedService,
    ) { }

    onStart(): void {
        RunService.Heartbeat.Connect(() => {
            this.updateCrimes();
        });

        Players.PlayerRemoving.Connect((player) => {
            this.cancelCrime(player);
        });
    }

    public startCrime(player: Player, crimeId: Id, instance: Instance): boolean {
        if (this.activeCrimes.has(player)) {
            return false;
        }

        if (!isPlayerAlive(player)) {
            return false;
        }

        const config = getCrimeConfig(crimeId);

        if (!config) {
            warn(`Unknown crime: ${crimeId}`);
            return false;
        }

        if (this.isOnCooldown(instance)) {
            return false;
        }

        const now = os.clock();

        const activeCrime: ActiveCrime = {
            player,
            crimeId,
            instance,

            startTime: now,
            endTime: now + config.duration,
        };

        this.activeCrimes.set(player, activeCrime);

        print("Crime started:", crimeId, "for player:", player.Name);
        return true;
    }

    public cancelCrime(player: Player): void {
        if (!this.activeCrimes.has(player)) {
            return;
        }

        this.activeCrimes.delete(player);
    }

    public isCommittingCrime(player: Player): boolean {
        return this.activeCrimes.has(player);
    }

    public getActiveCrime(player: Player): ActiveCrime | undefined {
        return this.activeCrimes.get(player);
    }

    private updateCrimes(): void {
        const now = os.clock();

        for (const [player, activeCrime] of this.activeCrimes) {
            if (!player.Parent) {
                this.activeCrimes.delete(player);
                continue;
            }

            if (!isPlayerAlive(player)) {
                this.cancelCrime(player);
                continue;
            }

            const config = getCrimeConfig(activeCrime.crimeId);

            if (now >= activeCrime.endTime) {
                this.completeCrime(activeCrime);
            }
        }
    }

    private completeCrime(activeCrime: ActiveCrime): void {
        const { player, crimeId, instance } = activeCrime;

        const config = getCrimeConfig(crimeId);

        this.activeCrimes.delete(player);
        this.wantedService.addStar(player, config.wantedLevel);

        this.cooldowns.set(instance, os.clock() + config.cooldown);
    }

    private isOnCooldown(instance: Instance): boolean {
        const cooldownEnd = this.cooldowns.get(instance);

        if (cooldownEnd === undefined) {
            return false;
        }

        if (os.clock() >= cooldownEnd) {
            this.cooldowns.delete(instance);
            return false;
        }

        return true;
    }
}