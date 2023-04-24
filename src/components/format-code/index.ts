import hljs from "highlight.js";
import highlighStyles from "highlight.js/styles/github.css?raw";

import PivotElement from "../pivot-element";
import styles from "./styles.css?raw";

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

const highlightSheet = new CSSStyleSheet();
highlightSheet.replaceSync(`@layer real { ${highlighStyles} }`);

class FormatCode extends PivotElement {
	language = "html";
	static template = `<pre><code id="code"></code></pre>`;
	code = this.index.code as HTMLElement;
	constructor() {
		super();
		this.shadow.adoptedStyleSheets = [
			...document.adoptedStyleSheets,
			highlightSheet,
			sheet,
		];
		console.debug(this.code);
	}

	connectedCallback() {
		super.connectedCallback();
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
		if (this.language === "html") {
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
