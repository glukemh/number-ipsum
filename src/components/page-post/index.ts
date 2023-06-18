import "components/main-nav";
import shadowElement from "assets/shadow-element";
import template from "./template.html?raw";

class PagePost extends shadowElement(template) {
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
