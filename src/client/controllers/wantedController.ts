import { Controller, OnStart } from "@flamework/core";
import { Icon } from "@rbxts/topbar-plus";
import { Events } from "client/scripts/network";

interface WantedPayload {
	stars: number;
	remaining: number;
}

@Controller({})
export class WantedController implements OnStart {
	private readonly wantedImage = "rbxassetid://105923343725836";

	private icon!: Icon;
	private stars = 0;
	private remainingTime = 0;

	private countdownToken = 0;
	private isViewing = false;

	onStart(): void {
		this.icon = new Icon()
			.setImage(this.wantedImage)
			.setLabel("0")
			.setEnabled(false);

		this.icon.viewingStarted.Connect(() => {
			this.isViewing = true;
			this.updateLabel();
		});

		this.icon.viewingEnded.Connect(() => {
			this.isViewing = false;
			this.updateLabel();
		});

		Events.updateWanted.connect((payload: WantedPayload) => {
			this.stars = payload.stars;
			this.remainingTime = payload.remaining;

			this.countdownToken++;

			if (this.stars > 0 && this.remainingTime > 0) {
				this.startCountdown(this.countdownToken);
			} else {
				this.countdownToken = 0;
			}

			this.updateLabel();
		});
	}

	private startCountdown(token: number): void {
		task.spawn(() => {
			while (
				token === this.countdownToken &&
				this.stars > 0 &&
				this.remainingTime > 0
			) {
				task.wait(1);

				if (token !== this.countdownToken) {
					return;
				}

				this.remainingTime = math.max(0, this.remainingTime - 1);

				if (this.remainingTime <= 0) {
					this.stars = 0;
					this.countdownToken = 0;
					this.updateLabel();
					return;
				}

				this.updateLabel();
			}
		});
	}

	private updateLabel(): void {
		const hasWanted = this.stars > 0;

		this.icon.setEnabled(hasWanted);

		if (!hasWanted) {
			return;
		}

		if (this.isViewing) {
			this.icon.setLabel(
				`${this.stars} Star${this.stars === 1 ? "" : "s"} | ${this.formatTime(this.remainingTime)}`,
			);
		} else {
			this.icon.setLabel(tostring(this.stars));
		}
	}

	private formatTime(seconds: number): string {
		const total = math.max(0, math.floor(seconds));
		const minutes = math.floor(total / 60);
		const secs = total % 60;

		return `${minutes}m ${secs}s`;
	}
}