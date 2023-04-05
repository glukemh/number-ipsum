class FormatCode extends HTMLElement {
	#block = false;
	static get observedAttributes() {
		return ["block"];
	}

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
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
		const codeText = document.createTextNode(this.innerHTML);
		codeText.textContent = lines.join("\n").replace(/^\s+|\s+$/g, "");
		const pre = document.createElement("pre");
		const code = document.createElement("code");
		code.appendChild(codeText);
		pre.appendChild(code);
		pre.style.display = this.block ? "block" : "inline";
		this.shadowRoot?.appendChild(pre);
	}

	attributeChangedCallback(
		name: string,
		_oldValue: boolean,
		newValue: boolean
	) {
		if (name === "block") {
			this.block = newValue;
		}
	}

	get block() {
		return this.#block;
	}

	set block(value) {
		this.#block = value !== null && value !== false;
		const display = this.#block ? "block" : "inline";
		this.shadowRoot
			?.querySelector("pre")
			?.setAttribute("style", `display: ${display}`);
	}
}

customElements.define("format-code", FormatCode);

export default FormatCode;
