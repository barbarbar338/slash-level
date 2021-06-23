import { ActivityType, PresenceStatusData } from "discord.js";
import { config } from "dotenv";

config();

const CLIENT_ID = process.env.CLIENT_ID as string;

export const CONFIG = {
	TOKEN: process.env.TOKEN as string,
	MONGODB_URI: process.env.MONGODB_URI as string,
	PORT: parseInt(process.env.PORT as string),
	CLIENT_ID,
	SLASH_INVITE: `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&scope=applications.commands`,
	DEFAULT_INVITE: `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&scope=bot&permissions=268725328`,
	API_URL: "https://pinkie-api.fly.dev",
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
			type: ["WATCHING", "LISTENING", "COMPETING"] as ActivityType[],
		},
		status: ["idle", "online", "dnd"] as PresenceStatusData[],
		afk: false,
		shardID: 0,
	},
	DEFAULT_RANK_COLOR: "ffffff",
	API_URL: "https://discord.com/api/v8",
	SUPPORT_SERVER: "https://discord.gg/BjEJFwh",
};
