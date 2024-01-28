import { ActivityType } from "discord.js";
import { env } from "./env.js";

export const CONFIG = {
	...env,
	PRESENCE: {
		activity: {
			name: [
				"use /addrank to add a rank reward",
				"use /disablechannel to disable leveling on a channel",
				"use /disablerole to disable leveling for someone who has specified role",
				"use /enablechannel to enable channel again",
				"use /enablerole to enable role again",
				"use /info for more information",
				"use /leaderboards to see guild ranking",
				"use /ping to see bot's ping",
				"use /rank to see your ranking",
				"use /removerank to remove a rank reward",
				"use /setchannel to set level up channel",
				"use /setcolor to set your preffered rank card color",
				"use /setmessage to set level up message",
			],
			type: [
				ActivityType.Playing,
				ActivityType.Listening,
				ActivityType.Watching,
			],
		},
		status: ["idle", "online", "dnd"],
	},
};
