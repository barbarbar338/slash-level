import { logger } from "@slash-level/logger";
import { ShardingManager } from "discord.js";
import { CONFIG } from "./config/index.js";

const manager = new ShardingManager("./slashLevel.js", {
	respawn: true,
	token: CONFIG.BOT_TOKEN,
});

manager.spawn().then((shards) => {
	logger.info(`Spawned ${shards.size} shards!`);
});

manager.on("shardCreate", (shard) => {
	logger.info(`Launched shard ${shard.id + 1}/${manager.totalShards}`);
});
