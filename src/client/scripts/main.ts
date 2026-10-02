import { Controller, OnStart } from "@flamework/core";
import { UI } from "../ui";

@Controller()
export class Main implements OnStart {
    onStart() {
        UI.mount();
    }
}