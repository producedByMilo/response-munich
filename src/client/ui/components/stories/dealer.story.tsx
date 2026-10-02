import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import Dealer from "client/ui/dealer";

function story(target: Frame) {
    const root = ReactRoblox.createRoot(target);
    root.render(<Dealer />);

    return () => {
        root.unmount();
    };
}

export = story;