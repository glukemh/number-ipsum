import "/assets/adopt-sheets";
import templateStr from "./template.fragment.html?raw";

const template = document.createElement("template");
template.innerHTML = templateStr;

class HomePage extends HTMLElement {
	static content = template.content;
	content = HomePage.content.cloneNode(true) as DocumentFragment;
	shadow = this.attachShadow({ mode: "open" });
	constructor() {
		super();
		this.shadow.adoptedStyleSheets = [...document.adoptedStyleSheets];
		this.shadow.append(this.content);
	}
}

customElements.define("home-page", HomePage);

export default HomePage;
