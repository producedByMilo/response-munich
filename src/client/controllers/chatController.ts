import { Controller, OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";

const TextChatService = game.GetService("TextChatService") as TextChatService;

type ChatUi = {
	ChatWindowConfiguration: {
		Enabled: boolean;
	};
	ChannelTabsConfiguration: {
		Enabled: boolean;
	};
	BubbleChatConfiguration: {
		Enabled: boolean;
	};
	ChatInputBarConfiguration: {
		Enabled: boolean;
	};
};

function showOnlyChatInputAndBubbles() {
	pcall(() => {
		const ui = TextChatService as unknown as ChatUi;

		ui.ChatWindowConfiguration.Enabled = false;
		ui.ChannelTabsConfiguration.Enabled = false;
		ui.BubbleChatConfiguration.Enabled = true;
		ui.ChatInputBarConfiguration.Enabled = true;
	});
}

@Controller({})
export class ChatController implements OnStart {
	onStart() {
		task.defer(showOnlyChatInputAndBubbles);
		task.delay(0.5, showOnlyChatInputAndBubbles);
		task.delay(2.2, showOnlyChatInputAndBubbles);
	}

	public showChatBubble(userId: number, displayName: string, text: string) {
		const player = Players.GetPlayerByUserId(userId);
		const character = player?.Character;

		if (!character) return;

		TextChatService.DisplayBubble(character, `${displayName}: ${text}`);
	}
}