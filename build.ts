import * as fs from "node:fs";
import * as path from "node:path";
import { exec } from "node:child_process";

const watch = process.argv.includes("--watch");
const root = "src";
const elementName = "html-from";
const shadowRoot = "shadow-root";
const replaceHtmlRegex = new RegExp(
	`<(?:${elementName})\\s+((?:src)=".*")\\s*>.*<\\/(?:${elementName})>`,
	"gs"
);
const replaceShadowRegex = new RegExp(
	`<(?:${shadowRoot})\\s+(?:(src=".*"))\\s*>.*<\\/(?:${shadowRoot})>`,
	"gs"
);
const outDir = "dist";
console.log("building...");

class GraphNode {
	name: string;
	dependencies: Set<GraphNode>;
	constructor(name: string, dependencies?: GraphNode[]) {
		this.name = name;
		this.dependencies = new Set(dependencies);
	}

	addDependency(node: GraphNode) {
		this.dependencies.add(node);
	}

	removeDependency(node: GraphNode) {
		this.dependencies.delete(node);
	}

	hasDependency(node: GraphNode) {
		return this.dependencies.has(node);
	}

	clearDependencies() {
		this.dependencies.clear();
	}
}

await copyTo(root, outDir, (name) => !name.endsWith(".ts"));
exec("npm run tsc", (err) => {
	if (err) {
		console.error(err);
	}
});

const htmlFiles = nodeMapFromFiles(root, ".html");
buildDependencyGraph(root, htmlFiles);
let cycle = hasCycle(htmlFiles);
if (cycle) {
	console.error(`Dependency cycle detected: ${cycle.name}`);
} else {
	for (const filePath of htmlFiles.keys()) {
		buildFile(root, filePath, outDir);
	}
	console.log("build complete");
}

if (watch) {
	console.log("watching for changes...");
	fs.watch(root, { recursive: true }, (event, filePath) => {
		switch (event) {
			case "change":
				if (filePath) {
					handleFileChange(root, filePath, outDir);
				}
				break;
		}
	});
	exec("npm run tsc -- --watch", (err, stdout) => {
		console.log(stdout);
		if (err) {
			console.error("Error running tsc:", err);
		}
	});
}

// ~~~~~ functions ~~~~~
async function copyTo(
	from: string,
	to: string,
	filter?: (name: string) => Boolean
) {
	const reader = fs.opendirSync(from);
	for await (const file of reader) {
		const filePath = path.join(from, file.name);
		const outPath = path.join(to, file.name);
		if (file.isFile() && (filter ? filter(file.name) : true)) {
			const outDir = path.dirname(outPath);
			if (!fs.existsSync(outDir)) {
				fs.mkdirSync(outDir, { recursive: true });
			}
			fs.copyFileSync(filePath, outPath);
		} else if (file.isDirectory()) {
			copyTo(filePath, outPath, filter);
		}
	}
}

function handleFileChange(root: string, filePath: string, outDir: string) {
	if (filePath.endsWith(".html")) {
		console.log(`rebuilding html ${filePath}...`);
		const node = htmlFiles.get(filePath);
		if (!node) {
			console.warn(`File not indexed: ${filePath}`);
			return;
		}
		setNodeDependencies(root, node, htmlFiles);
		if (hasLocalCycle(node)) {
			console.error(`Dependency cycle detected: ${node.name}`);
			return;
		}
		buildFile(root, filePath, outDir);
		console.log("done rebuilding");
	} else if (!filePath.endsWith(".ts")) {
		const outPath = path.join(outDir, filePath);
		const rootPath = path.join(root, filePath);
		console.log(`copying ${rootPath} to ${outPath}`);
		if (!fs.existsSync(outPath)) {
			fs.mkdirSync(path.dirname(outPath), { recursive: true });
		}
		fs.copyFileSync(rootPath, outPath);
	}
}

function buildFile(root: string, filePath: string, outDir: string) {
	const html = recursiveHtmlBundle(
		root,
		fs.readFileSync(path.join(root, filePath), "utf-8")
	);
	const outPath = path.join(outDir, filePath);
	if (!fs.existsSync(path.dirname(outPath))) {
		fs.mkdirSync(path.dirname(outPath), { recursive: true });
	}
	fs.writeFileSync(outPath, html);
}

function nodeMapFromFiles(root: string, ext: string) {
	const nodeMap = new Map<string, GraphNode>();
	const mapFilesToNodes = (filePath: string) => {
		const files = fs.readdirSync(filePath, { withFileTypes: true });
		for (const file of files) {
			if (file.isFile() && file.name.endsWith(ext)) {
				const relativePath = path.relative(
					root,
					path.join(filePath, file.name)
				);
				nodeMap.set(relativePath, new GraphNode(relativePath));
			} else if (file.isDirectory()) {
				mapFilesToNodes(path.join(filePath, file.name));
			}
		}
	};
	mapFilesToNodes(root);
	return nodeMap;
}

function buildDependencyGraph(root: string, nodeMap: Map<string, GraphNode>) {
	for (const node of nodeMap.values()) {
		setNodeDependencies(root, node, nodeMap);
	}
}

function hasLocalCycle(
	node: GraphNode,
	visited: Set<GraphNode> = new Set<GraphNode>(),
	stack: Set<GraphNode> = new Set<GraphNode>()
) {
	if (stack.has(node)) return true;
	if (visited.has(node)) return false;
	stack.add(node);
	visited.add(node);
	for (const dependency of node.dependencies) {
		if (hasLocalCycle(dependency, visited, stack)) return true;
	}
	stack.delete(node);
	return false;
}

function hasCycle(nodeMap: Map<string, GraphNode>) {
	const mapCopy = new Map(nodeMap);
	while (mapCopy.size) {
		const node = mapCopy.values().next().value as GraphNode;
		const visited = new Set<GraphNode>();
		if (hasLocalCycle(node, visited, new Set<GraphNode>())) {
			return node;
		}
		for (const node of visited) {
			mapCopy.delete(node.name);
		}
	}
	return false;
}

function setNodeDependencies(
	root: string,
	node: GraphNode,
	nodeMap: Map<string, GraphNode>
) {
	node.clearDependencies();
	const html = fs.readFileSync(path.join(root, node.name), {
		encoding: "utf-8",
	});
	const attributesList = [
		...elementAttributes(html, replaceHtmlRegex),
		...elementAttributes(html, replaceShadowRegex),
	];
	for (const attributes of attributesList) {
		if (typeof attributes.src === "string") {
			const relativePath = path.relative(root, path.join(root, attributes.src));
			const dependencyNode = nodeMap.get(relativePath);
			if (dependencyNode) {
				node.addDependency(dependencyNode);
			}
		}
	}
}

function elementAttributes(html: string, attributeMatch: RegExp) {
	const matches = html.matchAll(attributeMatch) || [];
	const attributesList: any[] = [];
	for (const match of matches) {
		const [, ...attributeMatches] = match;
		attributesList.push(attributesFromStrings(attributeMatches));
	}
	return attributesList;
}

function attributesFromStrings(strings: string[]) {
	const attributes: Record<string, string | true> = {};
	for (const str of strings) {
		const i = str.indexOf("=");
		const key = i > -1 ? str.slice(0, i) : str;
		const value = key === str || str.slice(i + 2, str.length - 1);
		attributes[key] = value;
	}
	return attributes;
}

function recursiveHtmlBundle(root: string, html: string) {
	const expressionsToMatch = [replaceHtmlRegex, replaceShadowRegex];
	const matches = expressionsToMatch.map((regex) => {
		const [match] = html.matchAll(regex) || [];
		return match;
	});
	if (!matches.some(Boolean)) return html;
	let replacedHtml = html;
	for (const match of matches) {
		if (!match) continue;
		const [fullMatch, ...attributeMatches] = match;
		const attributes = attributesFromStrings(attributeMatches);
		if (typeof attributes.src !== "string")
			throw new Error("src attribute not found");
		const fullPath = path.join(root, attributes.src);
		let replacement = "";
		if (fs.existsSync(fullPath)) {
			replacement = fs.readFileSync(fullPath, "utf-8");
		}
		replacedHtml = replacedHtml.replace(fullMatch, replacement);
	}
	return recursiveHtmlBundle(root, replacedHtml);
}
