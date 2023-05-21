import hljs from "highlight.js";
import highlightStyles from "highlight.js/styles/github.css?raw";
import styles from "./styles.css?raw";

const template = document.createElement("template");
template.innerHTML = `<pre><code></code></pre>`;

class FormatCode extends HTMLElement {
	static content = template.content;
	static styles = [styles, `@layer group { ${highlightStyles} }`];
	content = FormatCode.content.cloneNode(true) as DocumentFragment;
	shadow = this.attachShadow({ mode: "open" });
	code = this.content.querySelector("code") as HTMLElement;
	styleSheet = new CSSStyleSheet();
	language = this.getAttribute("language") || "xml";

	constructor() {
		super();
		for (const style of FormatCode.styles) {
			this.styleSheet.insertRule(style);
		}
		this.shadow.adoptedStyleSheets = [
			...document.adoptedStyleSheets,
			this.styleSheet,
		];
		this.shadow.append(this.content);
	}

	connectedCallback() {
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
