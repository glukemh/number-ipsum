import styles from "./styles.css?raw";
import templateStr from "./template.fragment.html?raw";

const template = document.createElement("template");
template.innerHTML = templateStr;

class MainNav extends HTMLElement {
	static content = template.content;
	static styles = styles;
	shadow = this.attachShadow({ mode: "open" });
	styleSheet = new CSSStyleSheet();
	content = MainNav.content.cloneNode(true) as DocumentFragment;
	heading = this.content.querySelector("h1") as HTMLHeadingElement;
	nav = this.content.querySelector("nav") as HTMLElement;
	constructor() {
		super();
		this.shadow.adoptedStyleSheets = [
			...document.adoptedStyleSheets,
			this.styleSheet,
		];
		this.styleSheet.replaceSync(MainNav.styles);
		this.heading.textContent = document.title;
		this.shadow.append(this.content);
	}
}

if (!customElements.get("main-nav")) {
	customElements.define("main-nav", MainNav);
}

export default MainNav;
