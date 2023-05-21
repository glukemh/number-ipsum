import { defineConfig } from "vite";
import path from "path";
import fs from "fs";
import { promisify } from "util";

const root = "src";
const exclude = new Set(
	["assets", "components"].map((dir) => path.join(root, dir))
);

const entryPoints = await getEntryPoints(root);

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

export default defineConfig({
	root,
	publicDir: root + "/assets",
	optimizeDeps: {
		include: [],
	},
	build: {
		emptyOutDir: true,
		outDir: path.join(__dirname, "dist"),
		target: "esnext",
		rollupOptions: {
			input: entryPoints,
		},
	},
	plugins: [htmlExtFallback],
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
			files.filter((file) => !exclude.has(file)).map(getEntryPoints)
		)
	)
		.flat()
		.filter((file) => file.endsWith(".html"));
}
