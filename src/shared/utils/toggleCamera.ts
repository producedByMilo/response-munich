import { UserInputService, Workspace } from "@rbxts/services";
let previousCameraType: Enum.CameraType = Enum.CameraType.Custom;
let previousMouseBehavior: Enum.MouseBehavior = Enum.MouseBehavior.Default;
export function toggleCamera(bool: boolean): void {
    const camera = Workspace.CurrentCamera as Camera;
    if (bool) {
        previousCameraType = camera.CameraType;
        previousMouseBehavior = UserInputService.MouseBehavior;
        camera.CameraType = Enum.CameraType.Scriptable;
        UserInputService.MouseBehavior = Enum.MouseBehavior.Default;
    } else {
        camera.CameraType = previousCameraType;
        UserInputService.MouseBehavior = previousMouseBehavior;
    }
}