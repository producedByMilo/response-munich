import { Networking } from "@flamework/networking";
import { Payload } from "./modules/wanted";

interface ClientToServerEvents {
	setSprinting: (sprinting: boolean) => void;
	sendDealerRequest: (request: string) => void;
}

interface ServerToClientEvents {
	updateWanted: (payload: Payload) => void;
	updateEnergy: (energy: number) => void;
	sendDealer: () => void;
}

interface ClientToServerFunctions {
}

interface ServerToClientFunctions {
}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>();