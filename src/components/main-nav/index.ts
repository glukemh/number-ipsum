import styles from "./styles.css?raw";
import templateContent from "./template.fragment.html?raw";
import getReactiveNodes from "../../assets/reactive-nodes";

const template = document.createElement("template");
template.innerHTML = templateContent;
const style = document.createElement("style");
style.textContent = styles;
template.content.prepend(style);

class MainNav extends HTMLElement {
	#pageTitle: string | null = null;
	#random: number = 0;
	#shadow: ShadowRoot;
	#content: Node;
	#reactiveNodes: ReturnType<typeof getReactiveNodes>;

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "open" });
		this.#shadow.adoptedStyleSheets = [...document.adoptedStyleSheets];
		this.#content = template.content.cloneNode(true);
		this.#reactiveNodes = getReactiveNodes(this.#content);
		this.pageTitle = document.title;
		this.random = Math.random();
	}

	connectedCallback() {
		this.#shadow.replaceChildren(this.#content);
	}

	set pageTitle(value: string | null) {
		this.#pageTitle = value;
		this.setNodeValue("pageTitle", value);
	}

	get pageTitle(): string | null {
		return this.#pageTitle;
	}

	get random(): number {
		return this.#random;
	}

	set random(value: number) {
		this.#random = value;
		this.setNodeValue("random", value.toString());
	}

	setNodeValue(name: string, value: string | null) {
		this.#reactiveNodes.get(name)?.(value);
	}
}

if (!customElements.get("main-nav")) {
	customElements.define("main-nav", MainNav);
}

export default MainNav;
