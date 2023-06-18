import fs from "fs";

// copy folder ./src/assets to ./dist/assets
const reader = fs.opendirSync("./src/assets");
for await (const dirent of reader) {
	if (dirent.isFile()) {
		fs.copyFileSync(
			`./src/assets/${dirent.name}`,
			`./dist/assets/${dirent.name}`
		);
	}
}
