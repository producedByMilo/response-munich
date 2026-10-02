import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { Players } from "@rbxts/services";

export namespace UI {
    export function mount() {
        const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;

        const container = new Instance("ScreenGui");
        container.Name = "App";
        container.IgnoreGuiInset = true;
        container.ResetOnSpawn = false;
        container.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;
        container.ClipToDeviceSafeArea = false;
        container.Parent = playerGui;

        const children: Record<string, React.Element> = {};

        for (const child of script.GetChildren()) {
            if (child === script) continue;
            if (!child.IsA("ModuleScript")) continue;

            const component = require(child) as React.FunctionComponent;
            children[child.Name] = React.createElement(component);
        }

        const app = React.createElement(React.Fragment, {}, children);
        const root = ReactRoblox.createRoot(container);
        root.render(app);
    }
}