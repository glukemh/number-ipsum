import { defineConfig } from "vite";
import path from "path";
import fs from "fs";

const root = "src";

const htmlExtFallback = {
	name: "html-ext-fallback",
	configureServer(server) {
		server.middlewares.use((req, res, next) => {
			// Check extensionless URLs but ignore the `/` root path
			if (req.originalUrl.length > 1 && !path.extname(req.originalUrl)) {
				if (
					fs.existsSync(path.join(__dirname, root, `${req.originalUrl}.html`))
				) {
					req.url += ".html";
				}
			}
			next();
		});
	},
};

const entryPoints = JSON.parse(fs.readFileSync("entry-points.json", "utf-8"));

export default defineConfig({
	root,
	publicDir: root + "/assets",
	optimizeDeps: {
		include: [],
	},
	build: {
		emptyOutDir: true,
		outDir: "../dist",
		rollupOptions: {
			input: entryPoints,
		},
	},
	plugins: [htmlExtFallback],
});
