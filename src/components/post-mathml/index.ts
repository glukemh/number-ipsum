import "components/format-code";
import "components/page-post";
import template from "./template.html?raw";
import shadowElement from "assets/shadow-element.js";

const PostMathML = shadowElement(template);

if (!customElements.get("post-mathml")) {
	customElements.define("post-mathml", PostMathML);
}

export default PostMathML;
