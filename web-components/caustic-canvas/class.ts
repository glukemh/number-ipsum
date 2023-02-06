import { CustomElement } from "types/custom-elements";

const template = /* html */ `
  <div>Web Component...</div>
`;

const CausticCanvas: CustomElement = class extends HTMLElement {
	static localName = "caustic-canvas" as const;
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}
	connectedCallback() {
		this.render();
	}
	render() {
		if (this.shadowRoot === null) throw new Error("Shadow root is null");
		this.shadowRoot.innerHTML = template;
	}
};

export default CausticCanvas;
