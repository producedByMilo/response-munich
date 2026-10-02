import { Flamework } from "@flamework/core";
import Log, { Logger } from "@rbxts/log";

Flamework.addPaths("src/server/components");
Flamework.addPaths("src/server/services");
Flamework.addPaths("src/shared/components");
Flamework.ignite();

Log.SetLogger(
    Logger.configure()
        .WriteTo(Log.RobloxOutput())
        .Create()
);
print("Server Flamework is ready!")