import { ContentProvider, Lighting, Players, Workspace } from "@rbxts/services";
import { Controller, OnStart } from "@flamework/core";

@Controller()
export class SceneLooksController implements OnStart {
    onStart(): void {
        task.defer(() => this.applyOutdoorLighting());
        Players.LocalPlayer.CharacterAdded.Connect((ch) => {
            task.defer(() => this.preloadCharacterSurfaceAssets(ch));
        });
        const ch0 = Players.LocalPlayer.Character;
        if (ch0) {
            task.defer(() => this.preloadCharacterSurfaceAssets(ch0));
        }
    }

    private applyOutdoorLighting(): void {
        pcall(() => {
            Lighting.GlobalShadows = true;
            Lighting.ShadowSoftness = 0.12;
            Lighting.ClockTime = 15.25;
            Lighting.GeographicLatitude = 36;
            Lighting.ExposureCompensation = 0.35;
            Lighting.Brightness = 2.35;
            Lighting.Ambient = Color3.fromRGB(128, 142, 168);
            Lighting.OutdoorAmbient = Color3.fromRGB(118, 132, 158);
            Lighting.EnvironmentSpecularScale = 1;
            Lighting.EnvironmentDiffuseScale = 1;
            Lighting.ColorShift_Top = Color3.fromRGB(214, 228, 255);
            Lighting.ColorShift_Bottom = Color3.fromRGB(96, 108, 132);
        });
        pcall(() => {
            let atmo = Lighting.FindFirstChildOfClass("Atmosphere");
            if (!atmo) {
                atmo = new Instance("Atmosphere");
                atmo.Parent = Lighting;
            }
            atmo.Density = 0.32;
            atmo.Offset = 0.12;
            atmo.Haze = 0.65;
            atmo.Color = Color3.fromRGB(188, 208, 238);
            atmo.Decay = Color3.fromRGB(148, 168, 198);
            atmo.Glare = 0.1;
        });
        pcall(() => {
            let sun = Lighting.FindFirstChildOfClass("SunRaysEffect");
            if (!sun) {
                sun = new Instance("SunRaysEffect");
                sun.Parent = Lighting;
            }
            sun.Intensity = 0.09;
        });
        pcall(() => {
            let bloom = Lighting.FindFirstChildOfClass("BloomEffect");
            if (!bloom) {
                bloom = new Instance("BloomEffect");
                bloom.Parent = Lighting;
            }
            bloom.Intensity = 0.55;
            bloom.Size = 18;
            bloom.Threshold = 1.85;
        });
        pcall(() => {
            let cc = Lighting.FindFirstChildOfClass("ColorCorrectionEffect");
            if (!cc) {
                cc = new Instance("ColorCorrectionEffect");
                cc.Parent = Lighting;
            }
            cc.TintColor = Color3.fromRGB(255, 248, 242);
            cc.Saturation = 0.06;
            cc.Contrast = 0.08;
            cc.Brightness = 0.02;
        });
    }

    private preloadCharacterSurfaceAssets(char: Model): void {
        const list = new Array<Instance>();
        for (const d of char.GetDescendants()) {
            if (d.IsA("Decal") || d.IsA("Texture")) {
                list.push(d);
            }
        }
        if (list.size() > 0) {
            task.spawn(() => {
                pcall(() => ContentProvider.PreloadAsync(list));
            });
        }
    }
}