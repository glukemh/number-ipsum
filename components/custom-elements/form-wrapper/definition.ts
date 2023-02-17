import {
	CustomElementLocalName,
	CustomElementClass,
} from "types/custom-elements";

const localName: CustomElementLocalName = "form-wrapper";
const FormWrapper: CustomElementConstructor = class
	extends HTMLElement
	implements CustomElementClass
{
	constructor() {
		super();
	}
	connectedCallback() {
		this.render();
	}
	render() {}
	template = "";
	styles = "";
};

if (!window.customElements.get(localName)) {
	window.customElements.define(localName, FormWrapper);
}

export default FormWrapper;
