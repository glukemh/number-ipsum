import styles from "./styles.css?raw";
import templateStr from "./template.html?raw";
import "/components/lo-go";
import shadowElement from "assets/shadow-element";

class MainNav extends shadowElement(templateStr, styles) {
	nav = this.shadow.querySelector("nav") as HTMLElement;
	scrollTimeout: number | null = null;
	lastScrollY = 0;
	constructor() {
		super();
		this.shadow.adoptedStyleSheets = [
			...document.adoptedStyleSheets,
			...this.shadow.adoptedStyleSheets,
		];
	}
}

if (!customElements.get("main-nav")) {
	customElements.define("main-nav", MainNav);
}

export default MainNav;
