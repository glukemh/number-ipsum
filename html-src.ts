import * as fs from "node:fs";
import * as path from "node:path";

const wcSsrRegex = /<html-src\s+((?:src)=".*")\s*>.*<\/html-src>/gs;
const files = fs.readdirSync("src", { withFileTypes: true });
for (const file of files) {
	processFile(file);
}

function processFile(file: fs.Dirent) {
	if (file.isDirectory()) {
		// recursively loop through all .html files in this directory
		const files = fs.readdirSync(path.join(file.path, file.name), {
			withFileTypes: true,
		});
		for (const file of files) {
			processFile(file);
		}
	} else {
		// process this file
		if (file.name.endsWith(".html")) {
			const html = fs.readFileSync(path.join(file.path, file.name), "utf-8");
			const newHtml = processHtml(html);
			fs.writeFileSync(path.join(file.path, "out-" + file.name), newHtml);
		}
	}
}

function processHtml(html: string) {
	const [match] = html.matchAll(wcSsrRegex) || [];
	if (!match) return html;
	const [fullMatch, ...attributeMatches] = match;
	const attributes = {
		src: "",
	};
	for (const str of attributeMatches) {
		const i = str.indexOf("=");
		const key = str.slice(0, i);
		const value = str.slice(i + 2, str.length - 1);
		attributes[key] = value;
	}
	const file = fs.readFileSync(path.join("src", attributes.src), "utf-8");
	console.debug("file", file);
	return processHtml(html.replace(fullMatch, file));
}
