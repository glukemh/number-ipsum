type ReactiveNodeMap = Map<string, (value: string | null) => void>;

export default (node: Node): ReactiveNodeMap => {
	function buildNodeMap(node: Node | null) {
		if (node === null) return;

		if (node instanceof HTMLElement) {
			for (let i = 0; i < node.attributes.length; i++) {
				buildNodeMap(node.attributes.item(i));
			}
		} else if (node instanceof Attr) {
			if (node.name.endsWith(":")) {
				const attrName = node.name.slice(0, -1);
				const attrNode = document.createAttribute(attrName);
				reactiveNodes.set(node.value, (value: string | null) => {
					if (value === null) {
						attrNode.ownerElement?.removeAttributeNode(attrNode);
						return;
					}
					attrNode.value = value;
					if (!attrNode.ownerElement) {
						node.ownerElement?.setAttributeNode(attrNode);
					}
				});
			}
		} else if (node instanceof Comment) {
			const textNode = document.createTextNode("");
			reactiveNodes.set(node.data, (value: string | null) => {
				if (value === null) {
					textNode.remove();
					return;
				}
				textNode.data = value;
				if (!textNode.isConnected) {
					node.parentNode?.insertBefore(textNode, node.nextSibling);
				}
			});
		}
		buildNodeMap(node.firstChild);
		buildNodeMap(node.nextSibling);
	}

	const reactiveNodes: ReactiveNodeMap = new Map();
	buildNodeMap(node);
	return reactiveNodes;
};
