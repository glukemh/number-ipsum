import shadowElement, { rangeTemplateMixin } from "/assets/mixins";
import template from "./template.html?raw";

class HomePage extends rangeTemplateMixin(shadowElement(template)) {
	ranges = this.getRangeMap(this.shadow);
	ul = this.shadow.querySelector("ul") as HTMLUListElement;
	scrollRange = this.ranges.get("scroll") as Range;
	scrollEl = this.rangeElements(this.scrollRange).nextNode() as HTMLDivElement;
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
