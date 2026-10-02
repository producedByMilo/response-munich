export function lerp(a: number, b: number, alpha: number): number {
    return a + (b - a) * math.clamp(alpha, 0, 1);
}

export function lerpUnclamped(a: number, b: number, alpha: number): number {
    return a + (b - a) * alpha;
}

export function smoothLerp(current: number, target: number, alpha: number, tolerance = 0.01): number {
    if (math.abs(current - target) <= tolerance) {
        return target;
    }

    return lerp(current, target, alpha);
}

export function moveTowards(current: number, target: number, maxDelta: number): number {
    if (current < target) {
        return math.min(current + maxDelta, target);
    }

    return math.max(current - maxDelta, target);
}