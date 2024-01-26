import { defineConfig } from "taze";

export default defineConfig({
	exclude: ["@repo/*"],
	recursive: true,
	force: true,
});
