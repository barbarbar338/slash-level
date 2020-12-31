import { Core } from "../struct/Core";
import * as pogger from "pogger";
import { CONFIG } from "../config";
import { IEvent } from "my-module";

const ReadyEvent: IEvent = {
	name: "ready",
	execute: async (client: Core) => {
		setInterval(async () => {
			await client.user?.setPresence({
				activity: {
					name: random(CONFIG.PRESENCE.activity.name),
					type: random(CONFIG.PRESENCE.activity.type),
				},
				status: random(CONFIG.PRESENCE.status),
				afk: CONFIG.PRESENCE.afk,
				shardID: CONFIG.PRESENCE.shardID,
			});
		}, 15000);
		pogger.success(`Logged in as ${client.user?.tag}!`);
	},
};

function random<T>(array: T[]): T {
	return array[Math.floor(Math.random() * array.length)];
}

export default ReadyEvent;
