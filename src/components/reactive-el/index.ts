// type EventHandler = (e: Event) => void;
type ReactiveNodeMap = Map<string, (value: string | null) => void>;
type ReactiveElProps = { template?: Template; adoptStyles?: boolean };
type Constructor = new (...args: any[]) => any;
type Template = Node | HTMLTemplateElement | string;
type SubclassAttributes = { template: Template };
// type Traversal = "nextSibling" | "previousSibling" | "firstChild" | "lastChild";
type AssociatedNode = Element | Attr | Comment | Text;
type ToString = { toString(): string };

class PivotMap {
	#map = new Map<string, Pivot>();
	constructor() {}

	get(id: string) {
		return this.#map.get(id)?.node || null;
	}

	set(id: string, node: AssociatedNode | null) {
		let pivot = this.#map.get(id);
		if (pivot) {
			pivot.node = node;
		} else if (node !== null) {
			pivot = new Pivot(node);
		} else {
			return this.#map.delete(id);
		}
		return this.#map.set(id, pivot);
	}

	val(id: string, value?: "string" | ToString | null) {
		const pivot = this.#map.get(id);
		if (!pivot) return null;
		if (value === undefined) {
			switch (pivot.node?.nodeType) {
				case Node.ELEMENT_NODE:
					return pivot.node as Element;
				case Node.ATTRIBUTE_NODE:
					return (pivot.node as Attr).value;
				case Node.TEXT_NODE:
				case Node.COMMENT_NODE:
					return (pivot.node as Text | Comment).data;
				default:
					return null;
			}
		} else if (value === null) {
			pivot.node = null;
			return null;
		}
		if (pivot.node) {
			switch (pivot.node.nodeType) {
				case Node.ELEMENT_NODE:
					if (value instanceof Element) {
						pivot.node = value;
					} else {
						pivot.node = document.createTextNode(value.toString());
					}
				case Node.ATTRIBUTE_NODE:
					if (value instanceof Attr) {
						pivot.node = value;
					} else {
						(pivot.node as Attr).value = value.toString();
					}
			}
		}
		switch (pivot.node) {
			case Node.ELEMENT_NODE:
				return node as Element;
			case Node.ATTRIBUTE_NODE:
				return (node as Attr).value;
			case Node.TEXT_NODE:
			case Node.COMMENT_NODE:
				return (node as Text | Comment).data;
			default:
				return null;
		}
		return this.get(id)?.nodeValue || null;
	}
}

class NamedPivot {
	#namedMap: NamedNodeMap;
	#node: Attr | null = null;
	constructor(attr: Attr | NamedNodeMap) {
		if (attr instanceof NamedNodeMap) {
			this.#namedMap = attr;
			return;
		} else if (!attr.ownerElement) {
			throw new Error("Attribute must have an owner element");
		}
		this.#namedMap = attr.ownerElement.attributes;
		this.#node = attr;
	}

	get node() {
		return this.#node;
	}

	set node(node: Attr | null) {
		if (this.#node) {
			this.#namedMap.removeNamedItem(this.#node.name);
		}
		this.#node = node;
		if (node === null) return;
		this.#namedMap.setNamedItem(node);
	}

	val(value?: string | ToString) {
		if (value === undefined || !this.#node) return this.#node?.value;
		return (this.#node.value = value.toString());
	}
}

class PositionedPivot {
	#node: Element | Text | null = null;
	#pivotNode: Comment;
	constructor(node: Element | Text | Comment) {
		switch (node.nodeType) {
			case Node.ELEMENT_NODE:
			case Node.TEXT_NODE:
				if (!node.parentNode) throw new Error("Node must have a parent node");
				this.#pivotNode = document.createComment(node.nodeName);
				node.parentNode.insertBefore(this.#pivotNode, node.nextSibling);
				return;
		}
		this.#pivotNode = node as Comment;
	}

	get node() {
		return this.#node;
	}

	set node(node: Element | Text | null) {
		if (this.#node && node !== null) {
			this.#node.replaceWith(node);
		} else if (this.#node && node === null) {
			this.#node.remove();
		} else if (this.#node === null && node !== null) {
			this.#pivotNode.parentNode?.insertBefore(
				node,
				this.#pivotNode.nextSibling
			);
		}
		this.#node = node;
	}

	val(value?: string | ToString | Element | Text) {
		if (value === undefined) {
			switch (this.#node?.nodeType) {
				case Node.ELEMENT_NODE:
					return this.#node as Element;
				case Node.TEXT_NODE:
					return (this.#node as Text).data;
				default:
					return null;
			}
		}
		if (value instanceof Element || value instanceof Text) {
			return (this.#node = value);
		} else {
			return (this.#node = document.createTextNode(value.toString()));
		}
	}
}

// class Pivot {
// 	#node: Node | null;
// 	#pivotNode: Node | null = null;
// 	#nodeMap: NamedNodeMap | null = null;
// 	constructor(node: AssociatedNode) {
// 		switch (node.nodeType) {
// 			case Node.ELEMENT_NODE:
// 			case Node.TEXT_NODE:
// 			case Node.COMMENT_NODE:
// 				this.#pivotNode = document.createComment(node.nodeName);
// 				break;
// 			case Node.ATTRIBUTE_NODE:
// 				this.#nodeMap = (node as Attr).ownerElement?.attributes || null;
// 				break;
// 			default:
// 		}
// 		this.#node = node;
// 	}

// 	get type() {
// 		return this.node?.nodeType;
// 	}

// 	get node() {
// 		return this.#node;
// 	}

// 	setNode(node: AssociatedNode) {
// 		this.#node = node;
// 	}

// 	removeNode() {
// 		if (this.node === null) return;
// 		switch (this.node.nodeType) {
// 			case Node.ELEMENT_NODE:
// 				(this.node as Element).remove();
// 			case Node.ATTRIBUTE_NODE:
// 				this.#nodeMap?.removeNamedItem(this.node.nodeName)

// 		}
// 	}

// 	set node(node: Node | null) {
// 		switch (node.nodeType) {
// 			case Node.ELEMENT_NODE:
// 			case Node.TEXT_NODE:
// 			case Node.COMMENT_NODE:
// 				this.#pivotNode = document.createComment(node.nodeName);
// 			case Node.ATTRIBUTE_NODE:
// 				this.#node = node;
// 	}

// 	remove() {
// 		switch (this.type) {
// 			case Node.ELEMENT_NODE:
// 		}
// 	}
// }

class ReactiveEl extends HTMLElement {
	shadow: ShadowRoot;
	reactiveNodes: ReturnType<typeof ReactiveEl.getReactiveNodes> = new Map();
	content: Node;

	// static template: Node | HTMLTemplateElement | string = '';

	constructor({ template, adoptStyles = true }: ReactiveElProps = {}) {
		super();
		const subclass = this.constructor as Constructor & SubclassAttributes;
		template ||= subclass.template;
		this.shadow = this.attachShadow({ mode: "open" });
		if (adoptStyles) {
			this.shadow.adoptedStyleSheets = [...document.adoptedStyleSheets];
		}
		if (typeof template === "string") {
			const templateEl = document.createElement("template");
			templateEl.innerHTML = template;
			this.content = templateEl.content;
		} else if (template instanceof HTMLTemplateElement) {
			this.content = template.content.cloneNode(true);
		} else {
			this.content = template.cloneNode(true);
		}
		this.reactiveNodes = ReactiveEl.getReactiveNodes(this.content);
	}

	connectedCallback() {
		this.shadow.replaceChildren(this.content);
	}

	set(name: string, value: string | null) {
		this.reactiveNodes.get(name)?.(value);
	}

	static getReactiveNodes = (node: Node): ReactiveNodeMap => {
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
}

export default ReactiveEl;
