import styles from "./styles.css?raw";
import template from "./template.fragment.html?raw";
import PivotElement from "../pivot-element";

class MainNav extends PivotElement {
	static template = template;
	styleSheet = new CSSStyleSheet();

	constructor() {
		super();
		this.shadow.adoptedStyleSheets = [
			...document.adoptedStyleSheets,
			this.styleSheet,
		];
		this.styleSheet.replaceSync(styles);
		this.index.pageTitle.textContent = document.title;
	}
}

if (!customElements.get("main-nav")) {
	customElements.define("main-nav", MainNav);
}

export default MainNav;
