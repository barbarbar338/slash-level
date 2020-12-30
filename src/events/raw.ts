import { IEvent, RawSlashEvent } from "my-module";
import { Core } from "../struct/Core";

const RawEvent: IEvent = {
	name: "raw",
	execute: async (client: Core, pack: RawSlashEvent) => {
		if (pack.t !== "INTERACTION_CREATE") return;
		const command = client.commands.get(pack.d.data.name);
		if (!command) return;
		command.execute({
			client,
			interaction: pack.d,
			args: pack.d.data.options,
		});
	},
};

export default RawEvent;
