import { CustomElement } from "types/custom-elements";

const template = /* html */ `
  <div>Form Component...</div>
`;

const FormWrapper: CustomElement = class extends HTMLElement {
	static localName = "form-wrapper" as const;
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

export default FormWrapper;
