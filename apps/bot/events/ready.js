/** @type {keyof import("discord.js").ClientEvents} */
const name = "ready";

/**
 * @param {import("../struct/SlashLevel").SlashLevel} client
 * @returns {Promise<boolean>}
 */
async function execute(client) {
	try {
		setInterval(
			() =>
				client.user.setPresence({
					activities: [
						{
							name: client.utils.getRandomElement(
								client.config.PRESENCE.activity.name,
							),
							type: client.utils.getRandomElement(
								client.config.PRESENCE.activity.type,
							),
						},
					],
					status: client.utils.getRandomElement(
						client.config.PRESENCE.status,
					),
				}),
			1000 * 15,
		);

		client.logger.info(`Bot ready, logged in as ${client.user.tag}`);

		return true;
	} catch (err) {
		client.logger.error(`Error in ${name} event`, err);
		return false;
	}
}

exports = { execute, name };
