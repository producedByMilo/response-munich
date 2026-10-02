export function clamp01(value: number): number {
	return math.clamp(value, 0, 1);
}

export function percentText(value: number): string {
	return `${math.floor(clamp01(value) * 100)}%`;
}