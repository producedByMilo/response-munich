import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import Phone from "client/ui/phone";

function story(target: Frame) {
    const root = ReactRoblox.createRoot(target);
    root.render(<Phone />);

    return () => {
        root.unmount();
    };
}

export = story;