import { CustomElement, CustomElementClass } from "types/custom-elements";

const FormWrapper: CustomElement = class
	extends HTMLElement
	implements CustomElementClass
{
	static localName = "form-wrapper" as const;
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

export default FormWrapper;
