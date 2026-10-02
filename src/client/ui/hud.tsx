import React, { useEffect, useState } from "@rbxts/react";
import { Players } from "@rbxts/services";
import { GetEnergy } from "shared/modules/energyState";

interface BarProps {
	value: number;
	fillColor: Color3;
	icon: string;
}

function Bar({ value, fillColor, icon }: BarProps) {
	const [fill, setFill] = useState(math.clamp(value, 0, 1));

	useEffect(() => {
		const target = math.clamp(value, 0, 1);

		const connection = task.spawn(() => {
			const start = fill;
			const duration = 0.25;
			const startTime = os.clock();

			while (true) {
				const elapsed = os.clock() - startTime;
				const alpha = math.clamp(elapsed / duration, 0, 1);

				const eased = 1 - math.pow(1 - alpha, 3);

				setFill(start + (target - start) * eased);

				if (alpha >= 1) {
					break;
				}

				task.wait();
			}
		});

		return () => {
			task.cancel(connection);
		};
	}, [value]);

	return (
		<frame
			BackgroundTransparency={1}
			Size={new UDim2(0, 210, 0, 18)}
		>
			<uilistlayout
				FillDirection={Enum.FillDirection.Horizontal}
				VerticalAlignment={Enum.VerticalAlignment.Center}
				Padding={new UDim(0, 8)}
			/>

			<imagelabel
				BackgroundTransparency={1}
				Size={new UDim2(0, 16, 0, 16)}
				Image={`rbxassetid://${icon}`}
				ImageColor3={fillColor}
			/>

			<frame
				Size={new UDim2(1, -24, 0, 10)}
				BackgroundColor3={Color3.fromRGB(22, 22, 26)}
				BackgroundTransparency={0.15}
				BorderSizePixel={0}
			>
				<uicorner CornerRadius={new UDim(1, 0)} />

				<frame
					Size={UDim2.fromScale(fill, 1)}
					BackgroundColor3={fillColor}
					BorderSizePixel={0}
				>
					<uicorner CornerRadius={new UDim(1, 0)} />

					<uigradient
						Color={
							new ColorSequence([
								new ColorSequenceKeypoint(0, fillColor),
								new ColorSequenceKeypoint(
									1,
									fillColor.Lerp(
										Color3.fromRGB(255, 255, 255),
										0.15,
									),
								),
							])
						}
					/>
				</frame>
			</frame>
		</frame>
	);
}

function Hud() {
	const [health, setHealth] = useState(1);
	const [energy, setEnergy] = useState(GetEnergy());

	useEffect(() => {
		const player = Players.LocalPlayer;

		const updateEnergy = () => {
			setEnergy(math.clamp(GetEnergy(), 0, 1));
		};

		updateEnergy();

		const connection = task.spawn(() => {
			while (true) {
				updateEnergy();
				task.wait();
			}
		});

		return () => {
			task.cancel(connection);
		};
	}, []);

	useEffect(() => {
		const player = Players.LocalPlayer;

		const characterConnection = player.CharacterAdded.Connect((character) => {
			const humanoid = character.WaitForChild("Humanoid") as Humanoid;

			const updateHealth = () => {
				setHealth(
					math.clamp(
						humanoid.Health / humanoid.MaxHealth,
						0,
						1,
					),
				);
			};

			updateHealth();

			const healthConnection =
				humanoid.HealthChanged.Connect(updateHealth);

			const maxHealthConnection =
				humanoid.GetPropertyChangedSignal("MaxHealth").Connect(
					updateHealth,
				);

			character.AncestryChanged.Connect(() => {
				if (!character.Parent) {
					healthConnection.Disconnect();
					maxHealthConnection.Disconnect();
				}
			});
		});

		return () => {
			characterConnection.Disconnect();
		};
	}, []);

	return (
		<frame
			AnchorPoint={new Vector2(0.5, 0)}
			Position={new UDim2(0.5, 0, 0, 10)}
			AutomaticSize={Enum.AutomaticSize.XY}
			BackgroundTransparency={1}
			BorderSizePixel={0}
		>
			<uipadding
				PaddingTop={new UDim(0, 12)}
				PaddingBottom={new UDim(0, 12)}
				PaddingLeft={new UDim(0, 14)}
				PaddingRight={new UDim(0, 14)}
			/>

			<uilistlayout
				FillDirection={Enum.FillDirection.Vertical}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				Padding={new UDim(0, 10)}
			/>

			<Bar
				value={health}
				fillColor={Color3.fromRGB(220, 80, 90)}
				icon="12473825091"
			/>

			<Bar
				value={energy}
				fillColor={Color3.fromRGB(70, 170, 255)}
				icon="13160015062"
			/>
		</frame>
	);
}

export = Hud;