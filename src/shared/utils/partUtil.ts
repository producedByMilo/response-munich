export function isInsidePart(position: Vector3, part: BasePart, padding = 0): boolean {
    const localPosition = part.CFrame.PointToObjectSpace(position);

    const halfSize = part.Size.div(2).add(
        new Vector3(padding, padding, padding),
    );

    return (
        math.abs(localPosition.X) <= halfSize.X &&
        math.abs(localPosition.Y) <= halfSize.Y &&
        math.abs(localPosition.Z) <= halfSize.Z
    );
}