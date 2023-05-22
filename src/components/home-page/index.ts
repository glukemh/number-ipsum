import "/assets/adopt-sheets";
import templateStr from "./template.fragment.html?raw";
import styles from "./styles.css?raw";

const template = document.createElement("template");
template.innerHTML = templateStr;

class HomePage extends HTMLElement {
	static content = template.content;
	static styles = styles;
	content = HomePage.content.cloneNode(true) as DocumentFragment;
	shadow = this.attachShadow({ mode: "open" });
	styleSheet = new CSSStyleSheet();
	ul = this.content.querySelector("ul") as HTMLUListElement;
	scrollEl = this.content.getElementById("scroll") as HTMLDivElement;
	constructor() {
		super();
		this.styleSheet.replaceSync(HomePage.styles);
		this.shadow.adoptedStyleSheets = [
			...document.adoptedStyleSheets,
			this.styleSheet,
		];
		this.shadow.append(this.content);
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
