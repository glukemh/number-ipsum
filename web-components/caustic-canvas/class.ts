import { CustomElement, CustomElementClass } from "types/custom-elements";
import { handler, map } from "utils/template";
import "../form-wrapper";

const CausticCanvas: CustomElement = class
	extends HTMLElement
	implements CustomElementClass
{
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
		this.shadowRoot.innerHTML = this.template;
	}

	debugEvent(e: Event, obj: { s: number }) {
		console.debug(obj.s);
	}

	debugEventHandler = handler(this.debugEvent);

	get template() {
		return /* html */ `
			<style>${this.styles}</style>
			${map/* html */ `<div>${[1, 2, 3].map((i) => i + 10)}</div>`}
			<div>Inner...</div>
			<button onclick="${this.debugEventHandler({
				s: 20,
			})}">Debug</button>
			<form-wrapper>
				<div>Form Children......</div>
			</form-wrapper>
		`;
	}

	get styles() {
		return /* css */ `
			:host {
				color: firebrick;
			}
		`;
	}
};

export default CausticCanvas;
