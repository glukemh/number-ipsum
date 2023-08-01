class LoGo extends HTMLElement {
	constructor() {
		super();
		this.innerHTML = "&#x2135;";
	}
}

if (!customElements.get("lo-go")) {
	customElements.define("lo-go", LoGo);
}

export default LoGo;
