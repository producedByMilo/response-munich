import { Flamework } from "@flamework/core";

const start = tick();
Flamework.addPaths("src/client/components");
Flamework.addPaths("src/client/controllers");
Flamework.addPaths("src/client/ui")
Flamework.addPaths("src/client/scripts");
Flamework.addPaths("src/shared/components");
Flamework.ignite();

print(`Client ready! Loaded in ${math.floor((tick() - start) * 100) / 100}s.`);