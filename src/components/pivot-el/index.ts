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

const PivotMapMixin = (Base: Constructor) => {
	return class PivotMap extends Base {
		pivots = new Map<string, Pivot>();
		get(id: string) {
			return this.pivots.get(id)?.node || null;
		}

		set(id: string, node: PivotNode) {
			let pivot = this.pivots.get(id);
			if (pivot) {
				pivot.node = node;
			} else if (node) {
				if (node.nodeType === Node.ATTRIBUTE_NODE) {
					pivot = new NamedPivot(node as Attr);
				} else {
					pivot = new PositionedPivot(node as Element | Text);
				}
			} else {
				throw new Error("Cannot set null node");
			}
			return this.pivots.set(id, pivot);
		}

		insert(id: string, pivot: Pivot) {
			return this.pivots.set(id, pivot);
		}

		delete(id: string) {
			return this.pivots.delete(id);
		}

		pivot(id: string, value?: PivotNode) {
			if (value !== undefined) this.set(id, value);
			return this.pivots.get(id)?.pivot();
		}

		hasConnection(id: string) {
			return this.pivots.get(id)?.connected;
		}
	};
};

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
				this.#pivotNode = document.createComment(node.nodeName);
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
		if (this.connected) {
			this.#node.replaceWith(node);
			return;
		}
		this.#node = node;
	}

	get connected() {
		return this.#node.isConnected;
	}

	pivot() {
		this.#pivotNode.parentNode?.insertBefore(
			this.#node,
			this.#pivotNode.nextSibling
		);
		return this.connected;
	}

	remove() {
		this.#node.remove();
	}
}

class PivotEl extends PivotMapMixin(HTMLElement) {
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
							this.set(attr.value, replacementAttr);
						} else if (attr.name === "id") {
							this.set(attr.value, attr.ownerElement);
						}
					}
					break;
				case Node.COMMENT_NODE:
					this.insert((n as Comment).data, new PositionedPivot(n as Comment));
			}
			n = nf.nextNode();
		}
	};
}

export { PivotEl, PivotMapMixin, PositionedPivot, NamedPivot };

export default PivotEl;
