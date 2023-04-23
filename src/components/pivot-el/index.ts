// type EventHandler = (e: Event) => void;
type PivotElProps = { template?: Template; adoptStyles?: boolean };
type Constructor = new (...args: any[]) => any;
type Template = Node | HTMLTemplateElement | string;
type SubclassAttributes = { template: Template };
type ToString = { toString(): string };
type PivotNode = Element | Attr | Text;
type NamedPivotNode = Attr;
type NamedPivotVal = string | ToString | Attr;
type PositionedPivotNode = Element | Text;
type PositionedPivotVal = string | ToString | Element | Text;
type Pivot = NamedPivot | PositionedPivot;
type PivotVal = NamedPivotVal | PositionedPivotVal;

function PivotIndexMixin<Base extends Constructor>(Base: Base) {
	return class PivotMap extends Base {
		index = new Map<string, Pivot>();
		get(id: string) {
			return this.index.get(id)?.node || null;
		}

		set(id: string, node: PivotNode | ((node: PivotNode) => PivotNode | void)) {
			let pivot = this.index.get(id);
			if (pivot) {
				if (typeof node === "function") {
					const resultNode = node(pivot.node);
					if (resultNode) {
						pivot.node = resultNode;
					}
				} else {
					pivot.node = node;
				}
			}
			return this;
		}

		insert(id: string, node: Element | Text | Comment | Attr | NamedNodeMap) {
			let pivot: Pivot;
			if (
				node instanceof Element ||
				node instanceof Text ||
				node instanceof Comment
			) {
				pivot = new PositionedPivot(node);
			} else {
				pivot = new NamedPivot(node);
			}
			this.index.set(id, pivot);
			return this;
		}

		delete(id: string) {
			return this.index.delete(id);
		}

		pivot(
			id: string,
			node?: PivotNode | ((node: PivotNode) => PivotNode | void)
		) {
			if (node !== undefined) this.set(id, node);
			const pivot = this.index.get(id);
			pivot?.pivot();
			return pivot?.node;
		}

		hasConnection(id: string) {
			return this.index.get(id)?.connected;
		}
	};
}

class NamedPivot {
	#namedMap: NamedNodeMap;
	#node: Attr;

	constructor(attr: Attr | NamedNodeMap) {
		if (attr instanceof NamedNodeMap) {
			this.#namedMap = attr;
			this.#node = document.createAttribute("data-pivot");
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

	set node(node: NamedPivotNode) {
		this.#namedMap.removeNamedItem(this.#node.name);
		this.#namedMap.setNamedItem(node);
		this.#node = node;
	}

	get connected() {
		return this.node.isConnected;
	}

	pivot() {
		this.#namedMap.setNamedItem(this.#node);
		return this.connected;
	}

	remove() {
		this.#namedMap.removeNamedItem(this.#node.name);
	}
}

class PositionedPivot {
	#pivotNode: Comment;
	#node: PositionedPivotNode;
	constructor(node: Element | Text | Comment) {
		switch (node.nodeType) {
			case Node.ELEMENT_NODE:
			case Node.TEXT_NODE:
				if (!node.parentNode) throw new Error("Node must have a parent node");
				this.#pivotNode = document.createComment(
					(node as Element).id || node.nodeName
				);
				node.parentNode.insertBefore(this.#pivotNode, node);
				this.#node = node as Element | Text;
				return;
		}
		this.#node = document.createTextNode("");
		this.#pivotNode = node as Comment;
	}

	get node() {
		return this.#node;
	}

	set node(node: PositionedPivotNode) {
		this.#node.replaceWith(node);
		this.#node = node;
	}

	get connected() {
		return this.#node.isConnected;
	}

	pivot() {
		return this.#pivotNode.parentNode?.insertBefore(
			this.#node,
			this.#pivotNode.nextSibling
		);
	}

	remove() {
		this.#node.remove();
	}
}

class PivotEl extends PivotIndexMixin(HTMLElement) {
	shadow: ShadowRoot;
	content: Node;

	static template: Node | HTMLTemplateElement | string = "";

	constructor({ template, adoptStyles = true }: PivotElProps = {}) {
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
		this.assignPivots(this.content);
	}

	connectedCallback() {
		this.shadow.replaceChildren(this.content);
	}

	assignPivots = (node: Node) => {
		const nf = document.createNodeIterator(
			node,
			NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_ELEMENT
		);
		let n = nf.nextNode();
		while (n) {
			switch (n.nodeType) {
				case Node.ELEMENT_NODE:
					for (const attr of (n as Element).attributes as NamedNodeMap & {
						[Symbol.iterator]: () => Iterator<Attr>;
					}) {
						if (attr.name.endsWith(":")) {
							const { ownerElement } = attr;
							const replacementAttr = document.createAttribute(
								attr.name.slice(0, -1)
							);
							ownerElement?.setAttributeNode(replacementAttr);
							ownerElement?.removeAttributeNode(attr);
							this.insert(attr.value, replacementAttr);
						} else if (attr.name === "id" && attr.ownerElement) {
							this.insert(attr.value, attr.ownerElement);
						}
					}
					break;
				case Node.COMMENT_NODE:
					this.insert((n as Comment).data, n as Comment);
			}
			n = nf.nextNode();
		}
	};
}

export { PivotEl, PivotIndexMixin, PositionedPivot, NamedPivot };

export default PivotEl;
