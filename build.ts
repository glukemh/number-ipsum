import * as fs from "node:fs";
import * as path from "node:path";

const root = "src";
const replaceHtmlRegex = /<html-src\s+((?:src)=".*")\s*>.*<\/html-src>/gs;
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
}
const htmlFiles = nodeMapFromFiles(root, ".html");
buildDependencyGraph(root, htmlFiles);
let cycle = hasCycle(htmlFiles);
if (cycle) {
	console.error(`Dependency cycle detected: ${cycle.name}`);
} else {
	for (const filePath of htmlFiles.keys()) {
		buildFile(root, filePath, "dist");
	}
	console.log("build complete");
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
		addNodeDependencies(root, node, nodeMap);
	}
}

function hasLocalCycle(
	node: GraphNode,
	visited: Set<GraphNode>,
	stack: Set<GraphNode>
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

function addNodeDependencies(
	root: string,
	node: GraphNode,
	nodeMap: Map<string, GraphNode>
) {
	const html = fs.readFileSync(path.join(root, node.name), {
		encoding: "utf-8",
	});
	const matches = html.matchAll(replaceHtmlRegex) || [];
	for (const match of matches) {
		const [, ...attributeMatches] = match;
		const attributes = {
			src: "",
		};
		for (const str of attributeMatches) {
			const i = str.indexOf("=");
			const key = str.slice(0, i);
			const value = str.slice(i + 2, str.length - 1);
			attributes[key] = value;
		}
		if (attributes.src) {
			const dependencyNode = nodeMap.get(path.join(root, attributes.src));
			if (dependencyNode) {
				node.addDependency(dependencyNode);
			}
		}
	}
}

function recursiveHtmlBundle(root: string, html: string) {
	const [match] = html.matchAll(replaceHtmlRegex) || [];
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
	const fullPath = path.join(root, attributes.src);
	let replacement = "";
	if (fs.existsSync(fullPath)) {
		replacement = fs.readFileSync(fullPath, "utf-8");
	}
	return recursiveHtmlBundle(root, html.replace(fullMatch, replacement));
}
