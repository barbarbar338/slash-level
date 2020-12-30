import { ICommand } from "my-module";

const PingCommand: ICommand = {
	name: "ping",
	description: "Shows the bot's ping.",
	options: [],
	async execute({ client, interaction }) {
		return client.send(
			interaction,
			`:ping_pong: Pong! ${client.ws.ping}ms`,
		);
	},
};

export default PingCommand;
