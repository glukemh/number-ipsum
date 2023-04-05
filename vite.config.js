import { resolve } from "path";
import { defineConfig } from "vite";
import path from "path";
import fs from "fs";

const mappings = {
	"/pages/hello": "/pages/hello/index.html",
};

const htmlExtFallback = {
	name: "html-ext-fallback",
	configureServer(server) {
		server.middlewares.use((req, res, next) => {
			// Check extensionless URLs but ignore the `/` root path
			if (req.originalUrl.length > 1 && !path.extname(req.originalUrl)) {
				const mapping = mappings[req.originalUrl];
				console.log("url", req.url);
				console.log("originalUrl", req.originalUrl);
				console.log("mapping", mapping);
				if (mapping) {
					req.url = mapping;
					console.log("url", req.url);
				} else if (
					fs.existsSync(path.join(__dirname, `${req.originalUrl}.html`))
				) {
					req.url += ".html";
				}
			}
			next();
		});
	},
};

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, "index.html"),
				...Object.fromEntries(
					Object.entries(mappings).map(([key, value]) => [
						key.replace("/", ""),
						value.replace("/", ""),
					])
				),
			},
		},
	},
	plugins: [htmlExtFallback],
});
