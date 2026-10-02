import { OnStart, OnTick, Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import { EnergyRegenerationService } from "./energyRegenerationService";
import { EnergyService } from "./energyService";
import { Events } from "server/network";

const WALK_SPEED = 12;
const SPRINT_SPEED = 18;
const ENERGY_COST_PER_SECOND = 10;

@Service()
export class EnergySprintService implements OnStart, OnTick {
    private readonly sprintingPlayers = new Set<Player>();

    constructor(
        private readonly energyService: EnergyService,
        private readonly energyRegenerationService: EnergyRegenerationService,
    ) { }

    onStart() {
        Events.setSprinting.connect((player, sprinting) => {
            this.setSprinting(player, sprinting);
        });

        Players.PlayerRemoving.Connect((player) => {
            this.sprintingPlayers.delete(player);
        });

        Players.PlayerAdded.Connect((player) => {
            player.CharacterAdded.Connect(() => {
                this.sprintingPlayers.delete(player);
            });
        });
    }

    onTick(deltaTime: number) {
        for (const player of this.sprintingPlayers) {
            const character = player.Character;
            const humanoid = character?.FindFirstChildOfClass("Humanoid");

            if (!humanoid || humanoid.MoveDirection.Magnitude <= 0) {
                continue;
            }

            const energyCost = ENERGY_COST_PER_SECOND * deltaTime;

            if (!this.energyService.removeEnergy(player, energyCost)) {
                this.stopSprinting(player, humanoid);
                continue;
            }

            this.energyRegenerationService.markEnergyUsed(player);
        }
    }

    private setSprinting(player: Player, sprinting: boolean) {
        const character = player.Character;
        const humanoid = character?.FindFirstChildOfClass("Humanoid");

        if (!humanoid) {
            return;
        }

        if (!sprinting) {
            this.stopSprinting(player, humanoid);
            return;
        }

        if (!this.energyService.hasEnergy(player)) {
            return;
        }

        this.sprintingPlayers.add(player);
        humanoid.WalkSpeed = SPRINT_SPEED;
    }

    private stopSprinting(player: Player, humanoid?: Humanoid) {
        this.sprintingPlayers.delete(player);

        if (humanoid) {
            humanoid.WalkSpeed = WALK_SPEED;
        }
    }
}