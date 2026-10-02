const Sounds = [
    { id: "pocketEquip", name: "Pocket Equip", assetId: "133643391270691" },
] as const;

export function getSound(nameOrId: string): Sound | undefined {
    const data = Sounds.find((sound) => sound.id === nameOrId || sound.name === nameOrId);
    if (!data) return undefined;

    const sound = new Instance("Sound");
    sound.Name = data.name;
    sound.SoundId = `rbxassetid://${data.assetId}`;

    return sound;
}