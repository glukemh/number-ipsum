import fs from "fs";
import path from "path";
import { promisify } from "util";

const root = "src/";
const exclude = new Set(
	["assets", "components"].map((dir) => path.join(root, dir))
);

const entryPoints = await getEntryPoints(root);
fs.writeFileSync("entry-points.json", JSON.stringify(entryPoints, null, 2));

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
