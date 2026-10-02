import React, { useEffect, useState } from "@rbxts/react";
import { Players, RunService } from "@rbxts/services";
import { getClockTime } from "shared/utils/getClockTime";

function Phone() {
    const player = Players.LocalPlayer;
    const [time, setTime] = useState("00:00");

    useEffect(() => {
        const updateTime = () => {
            const clockTime = getClockTime();
            const hours = math.floor(clockTime);
            const minutes = math.floor((clockTime - hours) * 60);

            setTime(`${string.format("%02d", hours)}:${string.format("%02d", minutes)}`);
        };

        updateTime();

        let elapsed = 0;
        const connection = RunService.Heartbeat.Connect((dt) => {
            elapsed += dt;

            if (elapsed >= 1) {
                elapsed = 0;
                updateTime();
            }
        });

        return () => connection.Disconnect();
    }, []);

    const money = player.GetAttribute("Money");
    const moneyText = typeIs(money, "number") ? `${math.floor(money)} €` : "0 €";

    return (
        <frame
            AnchorPoint={new Vector2(0.5, 0.5)}
            Position={new UDim2(0.1, 0, 0.63, 0)}
            Size={new UDim2(0.35, 0, 0.7, 0)}
            BackgroundColor3={Color3.fromRGB(25, 25, 28)}
            BorderSizePixel={0}
            Visible={false}
        >
            <uicorner CornerRadius={new UDim(0.07, 0)} />
            <uiaspectratioconstraint AspectRatio={0.55} />

            <frame
                AnchorPoint={new Vector2(0.5, 0)}
                Position={new UDim2(0.5, 0, 0, 0)}
                Size={new UDim2(1, 0, 0.08, 0)}
                BackgroundColor3={Color3.fromRGB(20, 20, 22)}
                BackgroundTransparency={1}
                BorderSizePixel={0}
            >
                <textlabel
                    AnchorPoint={new Vector2(0, 0.5)}
                    Position={new UDim2(0.05, 0, 0.5, 0)}
                    Size={new UDim2(0.4, 0, 0.8, 0)}
                    BackgroundTransparency={1}
                    Text={moneyText}
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    TextScaled
                    Font={Enum.Font.GothamMedium}
                    TextXAlignment={Enum.TextXAlignment.Left}
                />

                <textlabel
                    AnchorPoint={new Vector2(1, 0.5)}
                    Position={new UDim2(0.95, 0, 0.5, 0)}
                    Size={new UDim2(0.4, 0, 0.8, 0)}
                    BackgroundTransparency={1}
                    Text={time}
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    TextScaled
                    Font={Enum.Font.GothamMedium}
                    TextXAlignment={Enum.TextXAlignment.Right}
                />
            </frame>

            <frame
                AnchorPoint={new Vector2(0.5, 0)}
                Position={new UDim2(0.5, 0, 0.08, 0)}
                Size={new UDim2(1, 0, 0.83, 0)}
                BackgroundColor3={Color3.fromRGB(35, 35, 40)}
                BorderSizePixel={0}
            >
                <textlabel
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    Position={new UDim2(0.5, 0, 0.1, 0)}
                    Size={new UDim2(0.8, 0, 0.12, 0)}
                    BackgroundTransparency={1}
                    Text="Welcome"
                    TextColor3={Color3.fromRGB(180, 180, 185)}
                    TextScaled
                    Font={Enum.Font.GothamMedium}
                />

                <textlabel
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    Position={new UDim2(0.5, 0, 0.17, 0)}
                    Size={new UDim2(0.8, 0, 0.07, 0)}
                    BackgroundTransparency={1}
                    Text="What would you like to do?"
                    TextColor3={Color3.fromRGB(125, 125, 132)}
                    TextScaled
                    Font={Enum.Font.Gotham}
                />
            </frame>

            <frame
                AnchorPoint={new Vector2(0.5, 1)}
                Position={new UDim2(0.5, 0, 1, 0)}
                Size={new UDim2(1, 0, 0.08, 0)}
                BackgroundColor3={Color3.fromRGB(20, 20, 22)}
                BackgroundTransparency={1}
                BorderSizePixel={0}
            >
                <imagebutton
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    Position={new UDim2(0.5, 0, 0.4, 0)}
                    Size={new UDim2(0.2, 0, 0.55, 0)}
                    BackgroundColor3={Color3.fromRGB(92, 92, 92)}
                    BorderSizePixel={0}
                >
                    <uicorner CornerRadius={new UDim(1, 0)} />
                </imagebutton>
            </frame>
        </frame>
    );
}

export = Phone;