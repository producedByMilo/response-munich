import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import Hud from "client/ui/hud";

function story(target: Frame) {
    const root = ReactRoblox.createRoot(target);
    root.render(<Hud />);

    return () => {
        root.unmount();
    };
}

export = story;