import ShadowElement from "/assets/shadow-element.js";

class HomePage extends ShadowElement {
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
