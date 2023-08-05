import "./main-nav.js";
import ShadowElement from "/assets/shadow-element.js";

class PagePost extends ShadowElement {
	heading = this.shadow.querySelector("h1") as HTMLHeadingElement;
	static get observedAttributes() {
		return ["article-title"];
	}
	constructor() {
		super();
		this.articleTitle = this.getAttribute("article-title") || "";
	}

	get articleTitle() {
		return this.heading.textContent || "";
	}

	set articleTitle(value: string) {
		this.heading.textContent = value;
	}

	attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
		if (name === "article-title") {
			this.articleTitle = newValue;
		}
	}
}

if (!customElements.get("page-post")) {
	customElements.define("page-post", PagePost);
}

export default PagePost;
