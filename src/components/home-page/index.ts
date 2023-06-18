import shadowElement from "assets/shadow-element";
import template from "./template.html?raw";

class HomePage extends shadowElement(template) {
	ul = this.shadow.querySelector("ul") as HTMLUListElement;
	scrollEl = this.shadow.getElementById("scroll") as HTMLDivElement;
	constructor() {
		super();
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
