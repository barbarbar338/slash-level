import { LooseObject } from "my-module";
import fetch from "node-fetch";
import { CONFIG } from "../config";

export async function makeAPIRequest(
	path: string,
	method: string,
	body: LooseObject | string,
): Promise<any> {
	return new Promise((resolve, reject) => {
		fetch(`${CONFIG.API_URL}${path}`, {
			method,
			body: typeof body === 'string' ? body : JSON.stringify(body),
			headers: {
				Authorization: `Bot ${CONFIG.TOKEN}`,
				"Content-Type": "application/json",
			},
		})
			.then(resolve)
			.catch(reject);
	});
}
