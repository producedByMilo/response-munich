import { Controller, OnStart } from "@flamework/core";
import { Players, TweenService, UserInputService } from "@rbxts/services";

@Controller()
export class PhoneController implements OnStart {
    private readonly OPEN_POSITION = new UDim2(0.1, 0, 0.63, 0);
    private readonly CLOSED_POSITION = new UDim2(0.1, 0, 1.6, 0);
    private readonly TWEEN_INFO = new TweenInfo(0.45, Enum.EasingStyle.Quart, Enum.EasingDirection.Out);

    private animating = false;

    onStart(): void {
        const phone = this.getPhone();
        const button = phone.WaitForChild("5").WaitForChild("5") as ImageButton;
        UserInputService.InputBegan.Connect((input, gameProcessed) => {
            if (gameProcessed || input.KeyCode !== Enum.KeyCode.P) return;
            this.togglePhone();
        });

        button.Activated.Connect(() => {
            this.closePhone();
        });
    }

    private getPhone(): Frame {
        const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui");
        const app = playerGui.WaitForChild("App") as ScreenGui;
        return app.WaitForChild("phone") as Frame;
    }

    private togglePhone(): void {
        const phone = this.getPhone();
        if (this.animating) return;
        if (phone.Visible) {
            this.closePhone();
        } else {
            this.openPhone();
        }
    }

    private openPhone(): void {
        const phone = this.getPhone();
        if (phone.Visible || this.animating) return;
        this.animating = true;
        phone.Position = this.CLOSED_POSITION;
        phone.Visible = true;

        const tween = TweenService.Create(phone, this.TWEEN_INFO, {
            Position: this.OPEN_POSITION,
        });

        tween.Completed.Once(() => {
            this.animating = false;
        });

        tween.Play();
    }

    private closePhone(): void {
        const phone = this.getPhone();
        if (!phone.Visible || this.animating) return;
        this.animating = true;

        const tween = TweenService.Create(phone, this.TWEEN_INFO, {
            Position: this.CLOSED_POSITION,
        });

        tween.Completed.Once(() => {
            phone.Visible = false;
            this.animating = false;
        });

        tween.Play();
    }
}