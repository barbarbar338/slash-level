import { Logger } from "@hammerhq/logger";
import * as express from "express";
import { connection } from "mongoose";
import { CONFIG } from "../config";
import { Core } from "./Core";

export class HTTP {
	private readonly app = express();
	private readonly logger = new Logger("[HTTP]:");

	constructor(private readonly client: Core) {}

	private handleRoutes() {
		this.app.get("/", (req, res) => {
			res.status(200).json({
				client_ping: this.client.ws.ping,
				uptime: this.client.uptime,
				database: this.client.utils.resolveDBStatus(
					connection.readyState,
				),
			});
		});

		this.app.use((req, res) => {
			res.sendStatus(200);
		});
	}

	public init() {
		this.handleRoutes();

		this.app.listen(CONFIG.PORT, "0.0.0.0", () => {
			this.logger.info(`Listening on port ${CONFIG.PORT}`);
		});
	}
}
