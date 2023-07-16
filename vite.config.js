import { defineConfig } from "vite";
import path from "path";
import fs from "fs";
import { promisify } from "util";

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

const root = "dist";
const excludeEntryPoints = new Set(
	["assets", "components"].map((dir) => path.join(root, dir))
);
const entryPoints = await getEntryPoints(root);
export default defineConfig({
	root,
	plugins: [htmlExtFallback],
	optimizeDeps: {
		include: [],
	},
	build: {
		rollupOptions: {
			input: entryPoints,
		},
	},
});

async function isFile(path) {
	const stat = await promisify(fs.stat)(path);
	return stat.isFile();
}

async function getFiles(dir) {
	const files = await promisify(fs.readdir)(dir);
	return files.map((file) => path.join(dir, file));
}

async function getEntryPoints(dir) {
	if (await isFile(dir)) return dir;
	const files = await getFiles(dir);
	return (
		await Promise.all(
			files.filter((file) => !excludeEntryPoints.has(file)).map(getEntryPoints)
		)
	)
		.flat()
		.filter((file) => file.endsWith(".html"));
}
