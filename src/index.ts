import { Core } from "./struct/Core";
import * as express from "express";
import { CONFIG } from "./config";
import * as pogger from "pogger";
const client = new Core();
const app = express();
app.use((req, res) => res.sendStatus(200));
client.connect().then(() => {
	app.listen(CONFIG.PORT, "0.0.0.0", () => {
		pogger.success("Express server started");
	});
});
