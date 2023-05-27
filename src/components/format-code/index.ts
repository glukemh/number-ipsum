import hljs from "highlight.js";
import shadowElement from "assets/shadow-element";
import highlightStyles from "highlight.js/styles/github.css?raw";
import styles from "./styles.css?raw";

class FormatCode extends shadowElement("<pre><code></code></pre>", styles) {
	code = this.shadow.querySelector("code") as HTMLElement;
	language = this.getAttribute("language") || "xml";

	constructor() {
		super();
		this.styleSheet.insertRule(`@layer group { ${highlightStyles} }`);
		let text = this.innerHTML;
		text = text.trimEnd().replace(/^\n/, "");
		let lines = text.split("\n");
		while (lines.every((line) => /^\s/.test(line) || line === "")) {
			lines = lines.map((line) => {
				if (line === "") return line;
				return line.slice(1);
			});
		}
		text = lines.join("\n").replace(/^\s+|\s+$/g, "");
		if (this.language === "xml") {
			text = this.replaceHTML(text);
		}
		text = hljs.highlight(text, { language: this.language }).value;
		this.code.innerHTML = text;
	}

	replaceHTML(html: string) {
		return html.replaceAll("&lt;", "<").replaceAll("&gt;", ">");
	}
}

if (!customElements.get("format-code")) {
	customElements.define("format-code", FormatCode);
}

export default FormatCode;
