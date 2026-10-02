import { OnStart, Service } from "@flamework/core";
import { Players, RunService } from "@rbxts/services";
import { EnergyRegenerationService } from "./energyRegenerationService";
import { EnergyService } from "./energyService";

const JUMP_ENERGY_COST = 15;

@Service()
export class EnergyJumpService implements OnStart {
    constructor(
        private readonly energyService: EnergyService,
        private readonly energyRegenerationService: EnergyRegenerationService,
    ) { }

    onStart() {
        Players.PlayerAdded.Connect((player) => {
            player.CharacterAdded.Connect((character) => {
                this.setupCharacter(player, character);
            });
        });

        for (const player of Players.GetPlayers()) {
            if (player.Character) {
                this.setupCharacter(player, player.Character);
            }
        }
    }

    private setupCharacter(player: Player, character: Model) {
        const humanoid = character.WaitForChild("Humanoid") as Humanoid;
        const defaultJumpPower = humanoid.JumpPower;

        const updateJumpPower = () => {
            if (character.Parent === undefined) {
                return;
            }

            const energy = this.energyService.getEnergy(player);
            const canJump = energy >= JUMP_ENERGY_COST;

            humanoid.UseJumpPower = true;
            humanoid.JumpPower = canJump ? defaultJumpPower : 0;
        };

        const heartbeatConnection = RunService.Heartbeat.Connect(() => {
            if (character.Parent === undefined) {
                heartbeatConnection.Disconnect();
                return;
            }

            updateJumpPower();
        });

        humanoid.StateChanged.Connect((_, newState) => {
            if (newState !== Enum.HumanoidStateType.Jumping) {
                return;
            }

            const energy = this.energyService.getEnergy(player);

            if (energy < JUMP_ENERGY_COST) {
                return;
            }

            this.energyService.removeEnergy(player, JUMP_ENERGY_COST);
            this.energyRegenerationService.markEnergyUsed(player);
        });

        updateJumpPower();
    }
}