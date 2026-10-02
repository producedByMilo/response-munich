import React, { useState } from "@rbxts/react";

const weapons = ["Pistol", "Knife", "Grenade"];

function Dealer() {
    return (
        <frame
            AnchorPoint={new Vector2(0.5, 0.5)}
            Position={new UDim2(0.5, 0, 0.5, 0)}
            Size={new UDim2(0.5, 0, 0.75, 0)}
            BackgroundColor3={Color3.fromRGB(25, 25, 28)}
            BorderSizePixel={0}
            Visible={false}
        >
            <uicorner CornerRadius={new UDim(0.06, 0)} />

            <textlabel
                Position={new UDim2(0.04, 0, 0.03, 0)}
                Size={new UDim2(0.5, 0, 0.08, 0)}
                BackgroundTransparency={1}
                Text="Dealer"
                TextColor3={Color3.fromRGB(245, 245, 245)}
                TextScaled
                Font={Enum.Font.BuilderSansExtraBold}
                TextXAlignment={Enum.TextXAlignment.Left}
            />

            <imagebutton
                AnchorPoint={new Vector2(1, 0)}
                Position={new UDim2(0.96, 0, 0.025, 0)}
                Size={new UDim2(0, 40, 0, 40)}
                BorderSizePixel={0}
                Image="rbxassetid://79094744883261"
                BackgroundTransparency={1}
                ScaleType={Enum.ScaleType.Fit}
                AutoButtonColor={false}
            >
                <textlabel
                    Size={new UDim2(0, 40, 0, 40)}
                    BackgroundTransparency={1}
                    TextColor3={Color3.fromRGB(245, 245, 245)}
                    Text="X"
                    TextScaled
                    Font={Enum.Font.BuilderSansExtraBold}
                />
                <uicorner CornerRadius={new UDim(0.2, 0)} />
            </imagebutton>

            <frame
                Position={new UDim2(0.04, 0, 0.13, 0)}
                Size={new UDim2(0.92, 0, 0.82, 0)}
                BackgroundColor3={Color3.fromRGB(35, 35, 40)}
                BorderSizePixel={0}
            >
                <uicorner CornerRadius={new UDim(0.035, 0)} />

                <scrollingframe
                    Position={new UDim2(0.025, 0, 0.04, 0)}
                    Size={new UDim2(0.52, 0, 0.9, 0)}
                    BackgroundTransparency={1}
                    BorderSizePixel={0}
                    ScrollBarThickness={3}
                    ScrollBarImageColor3={Color3.fromRGB(100, 100, 105)}
                    CanvasSize={new UDim2(0, 0, 0, 0)}
                    AutomaticCanvasSize={Enum.AutomaticSize.Y}
                >
                    <uilistlayout Padding={new UDim(0.025, 0)} />

                    {weapons.map((weapon, index) => (
                        <textbutton
                            key={weapon}
                            Size={new UDim2(1, -8, 0, 55)}
                            BackgroundColor3={index === 0 ? Color3.fromRGB(48, 48, 54) : Color3.fromRGB(25, 25, 29)}
                            BorderSizePixel={0}
                            Text={weapon}
                            TextColor3={Color3.fromRGB(240, 240, 243)}
                            TextScaled
                            Font={Enum.Font.BuilderSansBold}
                            TextXAlignment={Enum.TextXAlignment.Left}
                            AutoButtonColor={false}
                        >
                            <uicorner CornerRadius={new UDim(0.12, 0)} />
                            <uipadding PaddingLeft={new UDim(0.06, 0)} />
                        </textbutton>
                    ))}
                </scrollingframe>

                <frame
                    Position={new UDim2(0.58, 0, 0.04, 0)}
                    Size={new UDim2(0.385, 0, 0.9, 0)}
                    BackgroundColor3={Color3.fromRGB(25, 25, 29)}
                    BorderSizePixel={0}
                >
                    <uicorner CornerRadius={new UDim(0.06, 0)} />

                    <imagelabel
                        AnchorPoint={new Vector2(0.5, 0)}
                        Position={new UDim2(0.5, 0, 0.08, 0)}
                        Size={new UDim2(0.65, 0, 0.3, 0)}
                        BackgroundTransparency={1}
                        Image="rbxassetid://14939112064"
                        ScaleType={Enum.ScaleType.Fit}
                    />

                    <textlabel
                        AnchorPoint={new Vector2(0.5, 0)}
                        Position={new UDim2(0.5, 0, 0.43, 0)}
                        Size={new UDim2(0.8, 0, 0.09, 0)}
                        BackgroundTransparency={1}
                        Text="Pistol"
                        TextColor3={Color3.fromRGB(245, 245, 248)}
                        TextScaled
                        Font={Enum.Font.BuilderSansExtraBold}
                    />

                    <textlabel
                        AnchorPoint={new Vector2(0.5, 0)}
                        Position={new UDim2(0.5, 0, 0.54, 0)}
                        Size={new UDim2(0.8, 0, 0.07, 0)}
                        BackgroundTransparency={1}
                        Text="500€"
                        TextColor3={Color3.fromRGB(255, 218, 30)}
                        TextScaled
                        Font={Enum.Font.BuilderSansBold}
                    />

                    <textlabel
                        AnchorPoint={new Vector2(0.5, 0)}
                        Position={new UDim2(0.5, 0, 0.62, 0)}
                        Size={new UDim2(0.82, 0, 0.16, 0)}
                        BackgroundTransparency={1}
                        Text="wer das liest stinkt"
                        TextColor3={Color3.fromRGB(140, 140, 148)}
                        TextScaled
                        TextWrapped
                        Font={Enum.Font.BuilderSans}
                    />

                    <textbutton
                        AnchorPoint={new Vector2(0.5, 1)}
                        Position={new UDim2(0.5, 0, 0.92, 0)}
                        Size={new UDim2(0.8, 0, 0.11, 0)}
                        BackgroundColor3={Color3.fromRGB(255, 218, 30)}
                        BorderSizePixel={0}
                        Text="Buy"
                        TextColor3={Color3.fromRGB(25, 25, 28)}
                        TextScaled
                        Font={Enum.Font.BuilderSansExtraBold}
                        AutoButtonColor={false}
                    >
                        <uicorner CornerRadius={new UDim(0.2, 0)} />
                    </textbutton>
                </frame>
            </frame>
        </frame>
    );
}

export = Dealer;