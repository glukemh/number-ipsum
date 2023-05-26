import "/components/format-code";
import templateStr from "./template.fragment.html?raw";
import styles from "./styles.css?raw";
import postsStyles from "/assets/posts.css?raw";

const template = document.createElement("template");
template.innerHTML = templateStr;

class PostMathmlArticle extends HTMLElement {
	static content = template.content;
	static styles = [styles, postsStyles];
	content = PostMathmlArticle.content.cloneNode(true) as DocumentFragment;
	styleSheet = new CSSStyleSheet();
	shadow = this.attachShadow({ mode: "open" });
	constructor() {
		super();
		this.shadow.adoptedStyleSheets = [
			...document.adoptedStyleSheets,
			this.styleSheet,
		];

		PostMathmlArticle.styles.forEach((style) => {
			this.styleSheet.insertRule(style);
		});
		this.shadow.append(this.content);
	}
  
  adoptStyles(sheet: CSSStyleSheet) {
    this.shadow.adoptedStyleSheets = 
  }
}

if (!customElements.get("post-mathml-article")) {
	customElements.define("post-mathml-article", PostMathmlArticle);
}

export default PostMathmlArticle;
