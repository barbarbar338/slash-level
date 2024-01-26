import { ActivityType } from "discord.js";
import { CONFIG } from "../config";

const ReadyEvent: SlashLevel.IEvent = {
	name: "ready",
	execute: async (client) => {
		setInterval(() => {
			client.user?.setPresence({
				activities: [
					{
						name: client.utils.random(
							CONFIG.PRESENCE.activity.name,
						),
						type: client.utils.random(
							CONFIG.PRESENCE.activity.type,
						) as ActivityType.Playing, // same reason, see Core.ts
					},
				],
				status: client.utils.random(CONFIG.PRESENCE.status),
			});
		}, 15000);

		client.logger.success(`Logged in as ${client.user?.tag}!`);
	},
};

export default ReadyEvent;
