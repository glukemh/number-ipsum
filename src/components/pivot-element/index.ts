type Template = Node | HTMLTemplateElement | string;
type PivotElProps = { template?: Node | HTMLTemplateElement | string };
type Constructor = new (...args: any[]) => any;
type SubclassAttributes = { template: Template };
type NamedAnchor = NamedNodeMap;
type PositionedAnchor = Comment;
type Anchor = NamedAnchor | PositionedAnchor;
type NamedNode = Attr;
type PositionedNode = Element | Text;
type PivotNode = NamedNode | PositionedNode;
type Pivot = NamedPivot | PositionedPivot;

function PivotIndexMixin<Base extends Constructor>(Base: Base) {
	return class PivotMap extends Base {
		#pivots = new Map<string, Pivot>();
		index: Record<string, NamedNode | PositionedNode> = {};

		get(id: string) {
			return this.#pivots.get(id)?.node || null;
		}

		set(id: string, node: PivotNode | ((node: PivotNode) => PivotNode | void)) {
			let pivot = this.#pivots.get(id);
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
			return pivot?.node;
		}

		insert(id: string, node: PivotNode | Anchor) {
			let pivot: Pivot;
			if (node instanceof Attr || node instanceof NamedNodeMap) {
				pivot = new NamedPivot(node);
			} else {
				pivot = new PositionedPivot(node);
			}
			this.#pivots.set(id, pivot);
			if (!(id in this.index)) {
				Object.defineProperty(this.index, id, {
					get: () => this.get(id),
					set: (node) => this.set(id, node),
				});
			}
			return pivot.node;
		}

		pivot(
			id: string,
			node?: PivotNode | ((node: PivotNode) => PivotNode | void)
		) {
			if (node !== undefined) this.set(id, node);
			const pivot = this.#pivots.get(id);
			pivot?.pivot();
			return pivot?.node;
		}

		anchorTo(id: string, anchor: Anchor) {
			const pivot = this.#pivots.get(id);
			if (pivot) {
				pivot.anchor = anchor;
			}
			return pivot?.node;
		}

		remove(id: string) {
			const pivot = this.#pivots.get(id);
			pivot?.remove();
			return pivot?.node;
		}
	};
}

class NamedPivot {
	anchor: NamedAnchor;
	node: NamedNode;

	constructor(attr: NamedNode | NamedAnchor) {
		if (attr instanceof NamedNodeMap) {
			this.anchor = attr;
			this.node = document.createAttribute("data-attr");
			return;
		} else if (!attr.ownerElement) {
			throw new Error("Attribute must have an owner element");
		}
		this.anchor = attr.ownerElement.attributes;
		this.node = attr;
	}

	pivot() {
		this.remove();
		console.debug("Pivoting", this.node);
		this.anchor.setNamedItem(this.node);
	}

	remove() {
		this.node.ownerElement?.attributes.removeNamedItem(this.node.name);
	}
}

class PositionedPivot {
	anchor: PositionedAnchor;
	node: PositionedNode;
	constructor(node: PositionedNode | PositionedAnchor) {
		switch (node.nodeType) {
			case Node.ELEMENT_NODE:
			case Node.TEXT_NODE:
				if (!node.parentNode) throw new Error("Node must have a parent node");
				this.anchor = document.createComment(
					(node as Element).id || node.nodeName
				);
				node.parentNode.insertBefore(this.anchor, node);
				this.node = node as Element | Text;
				return;
		}
		this.node = document.createTextNode("");
		this.anchor = node as Comment;
	}

	pivot() {
		this.anchor.parentNode?.insertBefore(this.node, this.anchor.nextSibling);
	}

	remove() {
		this.node.remove();
	}
}

class PivotElement extends PivotIndexMixin(HTMLElement) {
	shadow: ShadowRoot;
	content: Node;

	static template: Node | HTMLTemplateElement | string = "";

	constructor({ template }: PivotElProps = {}) {
		super();
		const subclass = this.constructor as Constructor & SubclassAttributes;
		template ||= subclass.template;
		this.shadow = this.attachShadow({ mode: "open" });
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
					const replacements: [string, Attr, string][] = [];
					const { attributes } = n as Element;
					for (const attr of attributes as NamedNodeMap & {
						[Symbol.iterator]: () => Iterator<Attr>;
					}) {
						if (attr.name.endsWith(":")) {
							const name = attr.name.slice(0, -1);
							const i = name.lastIndexOf(":");
							const replacementAttr = document.createAttribute(
								name.slice(0, i)
							);
							replacementAttr.value = attr.value;
							replacements.push([
								name.slice(i + 1),
								replacementAttr,
								attr.name,
							]);
						} else if (attr.name === "id" && attr.ownerElement) {
							this.insert(attr.value, attr.ownerElement);
						}
					}
					for (const [name, attr, removeName] of replacements) {
						attributes.removeNamedItem(removeName);
						attributes.setNamedItem(attr);
						this.insert(name, attr);
					}
					break;
				case Node.COMMENT_NODE:
					let data = n.textContent || "";
					if (data.startsWith(":")) {
						data = data.slice(1);
						const i = data.indexOf(":");
						const id = data.slice(0, i);
						const text = data.slice(i + 1);
						n.textContent = id;
						this.insert(id, n as Comment);
						this.pivot(id, document.createTextNode(text));
					}
					break;
			}
			n = nf.nextNode();
		}
	};
}

export { PivotElement, PivotIndexMixin, PositionedPivot, NamedPivot };

export default PivotElement;
