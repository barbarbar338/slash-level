import { ActivityType, PresenceStatusData } from "discord.js";
import { config } from "dotenv";

config();

const CLIENT_ID = process.env.CLIENT_ID as string;
const IS_DEV = process.env.NODE_ENV === "development";

export const CONFIG = {
	IS_DEV,
	TOKEN: process.env.TOKEN as string,
	MONGODB_URI: process.env.MONGODB_URI as string,
	PORT: parseInt(process.env.PORT as string),
	CLIENT_ID,
	INVITE: `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&scope=bot+applications.commands&permissions=268725328`,
	EXAMPLE_GIF: "https://338.rocks/slash-example.gif",
	REPO_URL: "https://github.com/barisbored/slash-level",
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
		status: ["idle", "online", "dnd"] as PresenceStatusData[],
	},
	DEFAULT_RANK_COLOR: "ffffff",
	SUPPORT_SERVER: "https://discord.gg/BjEJFwh",
};
