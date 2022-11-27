import { Core } from "./struct/Core";
import { HTTP } from "./struct/HTTP";

const client = new Core();
const http = new HTTP(client);

client.connect().then(() => {
	http.init();
});
