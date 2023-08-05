import "./format-code.js";
import "./page-post.js";
import ShadowElement from "/assets/shadow-element.js";

class PostMathML extends ShadowElement {
	constructor() {
		super();
	}
}

if (!customElements.get("post-mathml")) {
	customElements.define("post-mathml", PostMathML);
}

export default PostMathML;
