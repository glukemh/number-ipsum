import styles from "./styles.css?raw";
import templateContent from "./template.fragment.html?raw";

const template = document.createElement("template");
template.innerHTML = templateContent;
const style = document.createElement("style");
style.textContent = styles;
template.content.prepend(style);

class MainNav extends HTMLElement {
	shadow: ShadowRoot;
	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: "open" });
		this.shadow.adoptedStyleSheets = [...document.adoptedStyleSheets];
	}

	connectedCallback() {
		this.shadow.replaceChildren(template.content.cloneNode(true));
	}
}

if (!customElements.get("main-nav")) {
	customElements.define("main-nav", MainNav);
}

export default MainNav;
