import "assets/adopt-sheets";
import "components/main-nav";
import shadowElement from "assets/shadow-element";
import templateStr from "./template.html?raw";
import styles from "./styles.css?raw";

class PagePost extends shadowElement(templateStr, styles) {
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
