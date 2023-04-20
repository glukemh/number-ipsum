// type EventHandler = (e: Event) => void;
type ReactiveNodeMap = Map<string, (value: string | null) => void>;
type ReactiveElProps = { template?: Template; adoptStyles?: boolean };
type Constructor = new (...args: any[]) => any;
type Template = Node | HTMLTemplateElement | string;
type SubclassAttributes = { template: Template };

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
