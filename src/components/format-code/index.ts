import styles from "./styles.css?raw";

const style = document.createElement("style");
style.textContent = styles;

class FormatCode extends HTMLElement {
	#block = false;
	#html = false;
	shadow: ShadowRoot;
	static get observedAttributes() {
		return ["block", "html"];
	}

	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: "open" });
		this.shadow.adoptedStyleSheets = [...document.adoptedStyleSheets];
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
		const codeText = document.createTextNode("");
		codeText.textContent = lines.join("\n").replace(/^\s+|\s+$/g, "");
		const pre = document.createElement("pre");
		const code = document.createElement("code");
		if (this.html) {
			code.innerHTML = codeText.textContent || "";
		} else {
			code.appendChild(codeText);
		}
		pre.appendChild(code);
		pre.style.display = this.block ? "block" : "inline";
		this.shadow.appendChild(style.cloneNode(true));
		this.shadow.appendChild(pre);
	}

	attributeChangedCallback(
		name: string,
		_oldValue: boolean,
		newValue: boolean
	) {
		if (name === "block") {
			this.block = newValue;
		} else if (name === "html") {
			this.html = newValue;
		}
	}

	get block() {
		return this.#block;
	}

	set block(value) {
		this.#block = value !== null && value !== false;
		const display = this.#block ? "block" : "inline";
		this.shadow
			.querySelector("pre")
			?.setAttribute("style", `display: ${display}`);
	}

	get html() {
		return this.#html;
	}

	set html(value) {
		this.#html = value !== null && value !== false;
		const code = this.shadow.querySelector("code");
		if (code) {
			if (this.#html) {
				code.innerHTML = code.textContent || "";
			} else {
				code.textContent = code.innerHTML;
			}
		}
	}
}

if (!customElements.get("format-code")) {
	customElements.define("format-code", FormatCode);
}

export default FormatCode;
