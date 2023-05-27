import "components/format-code";
import "components/page-post";
import template from "./template.html?raw";
import styles from "./styles.css?raw";
import shadowElement from "assets/shadow-element";

const PostMathML = shadowElement(template, styles);

if (!customElements.get("post-mathml")) {
	customElements.define("post-mathml", PostMathML);
}

export default PostMathML;
