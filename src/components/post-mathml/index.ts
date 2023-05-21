import "/assets/adopt-sheets";
import "/components/main-nav";
import "/components/format-code";
import postsStyles from "/assets/posts.css?raw";
import templateStr from "./template.fragment.html?raw";
import styles from "./styles.css?raw";

const template = document.createElement("template");
template.innerHTML = templateStr;

class PostMathML extends HTMLElement {
	static content = template.content;
	static styles = [styles, postsStyles];
	content = PostMathML.content.cloneNode(true) as DocumentFragment;
	styleSheet = new CSSStyleSheet();
	shadow = this.attachShadow({ mode: "open" });
	constructor() {
		super();
		this.shadow.adoptedStyleSheets = [
			...document.adoptedStyleSheets,
			this.styleSheet,
		];
		PostMathML.styles.forEach((style) => {
			this.styleSheet.insertRule(style);
		});
		this.shadow.append(this.content);
	}
}

if (!customElements.get("post-mathml")) {
	customElements.define("post-mathml", PostMathML);
}

export default PostMathML;
