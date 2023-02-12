import FormWrapper from "./class";

if (!customElements.get(FormWrapper.localName)) {
	customElements.define(FormWrapper.localName, FormWrapper);
}

export default FormWrapper;
