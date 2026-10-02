import { OnStart, Service } from "@flamework/core";
import { Players, RunService } from "@rbxts/services";
import ProfileService from "@rbxts/profileservice";

interface PlayerData {
	money: number;

	vehicles: never[];
	wantedLevel: number;

	health: number;
}

const PROFILE_STORE_NAME = RunService.IsStudio() ? "Testing" : "PlayerData";
const DEFAULT_DATA: PlayerData = {
	money: 8000,

	vehicles: [],
	wantedLevel: 0,

	health: 100,
};

const store = ProfileService.GetProfileStore<PlayerData>(PROFILE_STORE_NAME, DEFAULT_DATA);
type PlayerProfile = NonNullable<Awaited<ReturnType<typeof store.LoadProfileAsync>>>;


@Service({})
export class PlayerDataService implements OnStart {
	private store = ProfileService.GetProfileStore<PlayerData>(
		PROFILE_STORE_NAME,
		DEFAULT_DATA,
	);

	private profiles = new Map<Player, PlayerProfile>();
	private changedEvents = new Map<Player, Map<string, BindableEvent>>();

	onStart() {
		Players.GetPlayers().forEach((player) => {
			task.spawn(() => this.loadPlayer(player));
		});

		Players.PlayerAdded.Connect((player) => {
			task.spawn(() => this.loadPlayer(player));
		});

		Players.PlayerRemoving.Connect((player) => {
			this.unloadPlayer(player);
		});
	}


	private createLeaderstats(player: Player) {
		const folder = new Instance("Folder");
		folder.Name = "leaderstats";
		folder.Parent = player;

		const money = new Instance("IntValue");
		money.Name = "Money";
		money.Parent = folder;
	}

	private getChangedEvent(player: Player, key: string,) {
		let events = this.changedEvents.get(player);

		if (!events) {
			events = new Map();
			this.changedEvents.set(player, events);
		}

		let event = events.get(key);

		if (!event) {
			event = new Instance("BindableEvent");
			event.Name = `${key}Changed`;
			event.Parent = player;
			events.set(key, event);
		}

		return event;
	}

	getChangedSignal(player: Player, key: string,) {
		return this.getChangedEvent(player, key).Event;
	}

	private emit(player: Player, key: string, value: unknown,) {
		this.changedEvents.get(player)?.get(key)?.Fire(value);
	}

	private syncLeaderstats(player: Player) {
		const leaderstats = player.FindFirstChild("leaderstats");

		if (!leaderstats || !leaderstats.IsA("Folder")) return;
		const money = leaderstats.FindFirstChild("Money");

		if (money?.IsA("IntValue")) {
			money.Value = this.getMoney(player);

			this.getChangedSignal(player, "money").Connect((value) => {
				money.Value = value as number;
			});
		}
	}

	private async loadPlayer(player: Player) {
		this.createLeaderstats(player);

		const profile = await this.store.LoadProfileAsync(
			`Player_${player.UserId}`,
		)

		if (!profile) {
			player.Kick("Failed loading data.");
			return;
		}

		profile.AddUserId(player.UserId);
		profile.Reconcile();

		profile.ListenToRelease(() => {
			this.profiles.delete(player);
			this.changedEvents.delete(player);

			if (player.Parent) {
				player.Kick("Profile released.");
			}
		});

		if (!player.IsDescendantOf(Players)) {
			profile.Release();
			return;
		}

		this.profiles.set(player, profile);

		player.CharacterAdded.Connect((character) => {
			const humanoid = character.WaitForChild("Humanoid") as Humanoid;

			humanoid.Health = math.clamp(profile.Data.health, 0, humanoid.MaxHealth);

			humanoid.HealthChanged.Connect((health) => {
				profile.Data.health = math.clamp(health, 0, humanoid.MaxHealth);
			});
		});

		if (player.Character) {
			const humanoid = player.Character.FindFirstChildOfClass("Humanoid");

			if (humanoid) {
				humanoid.Health = math.clamp(profile.Data.health, 0, humanoid.MaxHealth);

				humanoid.HealthChanged.Connect((health) => {
					profile.Data.health = math.clamp(health, 0, humanoid.MaxHealth);
				});
				print(profile.Data.health);
			}
		}

		this.syncLeaderstats(player);
	}

	private unloadPlayer(player: Player) {
		const profile = this.profiles.get(player);
		if (!profile) return;

		const character = player.Character;
		const humanoid = character?.FindFirstChildOfClass("Humanoid");

		if (humanoid) {
			profile.Data.health = math.clamp(
				humanoid.Health,
				0,
				humanoid.MaxHealth,
			);
		}

		print(profile.Data.health);
		profile.Release();
		const events = this.changedEvents.get(player);

		if (events) {
			events.forEach((event) => {
				event.Destroy();
			});
		}

		this.profiles.delete(player);
		this.changedEvents.delete(player);
	}

	getProfile(player: Player) {
		return this.profiles.get(player);
	}

	getData(player: Player) {
		return this.getProfile(player)?.Data;
	}

	getValue<K extends keyof PlayerData>(player: Player, key: K,) {
		return this.getProfile(player)?.Data[key];
	}

	setValue<K extends keyof PlayerData>(player: Player, key: K, value: PlayerData[K],) {
		const profile = this.getProfile(player);
		if (!profile) return;
		profile.Data[key] = value;
		this.emit(player, key as string, value);
	}

	incrementValue(player: Player, key: keyof PlayerData, amount: number,) {
		const current = (this.getValue(player, key) as number | undefined) ?? 0;
		this.setValue(player, key, (current + amount) as never,);
	}

	getMoney(player: Player) {
		return this.getValue(player, "money") ?? 0;
	}

	setMoney(player: Player, amount: number) {
		this.setValue(
			player,
			"money",
			math.max(0, amount),
		);
	}

	addMoney(player: Player, amount: number) {
		this.incrementValue(player, "money", amount);
	}
}