const { logger } = require("@slash-level/logger");
const { SlashLevel } = require("./struct/SlashLevel.js");

const slashLevel = new SlashLevel();

slashLevel.connect();

process.on("SIGINT", async () => {
	logger.warn("Received SIGINT, shutting down gracefully");

	await slashLevel.destroy();
	await slashLevel.sequelize.close();

	process.exit(0);
});
