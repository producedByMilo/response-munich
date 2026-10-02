let energy = 1;

export function GetEnergy(): number {
	return energy;
}

export function SetEnergy(value: number) {
	energy = math.clamp(value, 0, 1);
}

export function AddEnergy(amount: number) {
	SetEnergy(energy + amount);
}