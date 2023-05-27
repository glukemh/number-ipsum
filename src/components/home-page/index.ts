import "assets/adopt-sheets";
import shadowElement from "assets/shadow-element";
import templateStr from "./template.html?raw";
import styles from "./styles.css?raw";

class HomePage extends shadowElement(templateStr, styles) {
	ul = this.shadow.querySelector("ul") as HTMLUListElement;
	scrollEl = this.shadow.getElementById("scroll") as HTMLDivElement;
	constructor() {
		super();
		this.adoptStyleSheets(document.adoptedStyleSheets);
	}
	connectedCallback() {
		this.scrollEl.scrollLeft =
			(this.scrollEl.scrollWidth - this.scrollEl.clientWidth) / 2;
		this.scrollEl.scrollTop =
			(this.scrollEl.scrollHeight - this.scrollEl.clientHeight) / 2;
	}
}

if (!customElements.get("home-page")) {
	customElements.define("home-page", HomePage);
}

export default HomePage;
