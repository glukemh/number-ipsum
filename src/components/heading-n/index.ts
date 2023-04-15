class HeadingN extends HTMLElement {
	constructor() {
		super();
		const shadow = this.attachShadow({ mode: "open" });
		const h = document.createElement(`h${this.level}`);
		h.textContent = this.textContent;
		shadow.appendChild(h);
	}
	get level() {
		return this.getAttribute("level");
	}
	set level(value) {
		const n = Math.max(1, Math.min(parseInt(value || "", 10), 6));
		this.setAttribute("level", n.toString());
	}
}

customElements.define("heading-n", HeadingN);

export default HeadingN;
