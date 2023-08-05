import "./format-code";
import "./page-post";
import ShadowElement from "/assets/shadow-element";

class PostMathML extends ShadowElement {
	constructor() {
		super();
	}
}

if (!customElements.get("post-mathml")) {
	customElements.define("post-mathml", PostMathML);
}

export default PostMathML;
