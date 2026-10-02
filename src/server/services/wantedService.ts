import { Service, OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";
import { Events } from "../network";
import { PlayerDataService } from "./playerDataService";

interface WantedData {
	stars: number;
	expireAt: number;
}

@Service({})
export class WantedService implements OnStart {
	private readonly MAX_STARS = 5;
	private readonly STAR_DURATION = 60;

	private wantedData = new Map<Player, WantedData>();

	constructor(private readonly playerDataService: PlayerDataService) { }

	onStart(): void {
		Players.GetPlayers().forEach((player) => {
			this.loadWantedLevel(player);
		});

		Players.PlayerAdded.Connect((player) => {
			task.defer(() => this.loadWantedLevel(player));
		});

		Players.PlayerRemoving.Connect((player) => {
			this.wantedData.delete(player);
		});

		task.spawn(() => {
			while (true) {
				task.wait(1);

				const now = os.time();

				for (const [player, data] of this.wantedData) {
					if (data.stars <= 0 || data.expireAt <= now) {
						this.removeAllStars(player);
					}
				}
			}
		});
	}

	private loadWantedLevel(player: Player): void {
		task.spawn(() => {
			while (!this.playerDataService.getProfile(player)) {
				if (!player.IsDescendantOf(Players)) return;

				task.wait();
			}

			const wantedLevel =
				this.playerDataService.getValue(player, "wantedLevel") ?? 0;

			if (wantedLevel > 0) {
				this.setStars(player, wantedLevel);
			}
		});
	}

	public getStars(player: Player): number {
		return this.wantedData.get(player)?.stars ?? 0;
	}

	public isWanted(player: Player): boolean {
		const data = this.wantedData.get(player);

		if (!data) {
			return false;
		}

		return data.stars > 0 && data.expireAt > os.time();
	}

	public getRemainingTime(player: Player): number {
		const data = this.wantedData.get(player);

		if (!data || data.stars <= 0) {
			return 0;
		}

		return math.max(0, data.expireAt - os.time());
	}

	public setStars(player: Player, amount: number): void {
		const stars = math.clamp(
			math.floor(amount),
			0,
			this.MAX_STARS,
		);

		if (stars <= 0) {
			this.removeAllStars(player);
			return;
		}

		const expireAt = os.time() + stars * this.STAR_DURATION;

		this.wantedData.set(player, {
			stars,
			expireAt,
		});

		this.playerDataService.setValue(player, "wantedLevel", stars);
		this.updateClient(player);
	}

	// Adds stars
	public addStar(player: Player, amount = 1): void {
		const data = this.wantedData.get(player);

		const addedStars = math.max(0, math.floor(amount));

		if (addedStars <= 0) {
			return;
		}

		// Player is not wanted
		if (!data || data.stars <= 0) {
			this.setStars(
				player,
				math.min(addedStars, this.MAX_STARS),
			);

			return;
		}

		const now = os.time();
		const remaining = math.max(0, data.expireAt - now);

		if (remaining <= 0) {
			this.setStars(
				player,
				math.min(addedStars, this.MAX_STARS),
			);

			return;
		}

		const newStars = math.min(data.stars + addedStars, this.MAX_STARS,);

		// Every new star adds STAR_DURATION seconds to the wanted time
		const newExpireAt = data.expireAt + addedStars * this.STAR_DURATION;

		this.wantedData.set(player, {
			stars: newStars,
			expireAt: newExpireAt,
		});

		this.playerDataService.setValue(player, "wantedLevel", newStars);
		this.updateClient(player);
	}

	// Removes stars
	public removeStar(player: Player, amount = 1): void {
		const data = this.wantedData.get(player);

		if (!data) {
			return;
		}

		const removedStars = math.max(0, math.floor(amount));

		if (removedStars <= 0) {
			return;
		}

		const newStars = math.max(
			0,
			data.stars - removedStars,
		);

		if (newStars <= 0) {
			this.removeAllStars(player);
			return;
		}

		// Time reduction is based on the number of stars removed
		const newExpireAt = math.max(os.time(), data.expireAt - removedStars * this.STAR_DURATION);

		this.wantedData.set(player, {
			stars: newStars,
			expireAt: newExpireAt,
		});

		this.playerDataService.setValue(player, "wantedLevel", newStars);
		this.updateClient(player);
	}

	public removeAllStars(player: Player): void {
		this.wantedData.delete(player);

		this.playerDataService.setValue(player, "wantedLevel", 0);

		Events.updateWanted.fire(player, {
			stars: 0,
			remaining: 0,
		});
	}

	private updateClient(player: Player): void {
		Events.updateWanted.fire(player, {
			stars: this.getStars(player),
			remaining: this.getRemainingTime(player),
		});
	}
}