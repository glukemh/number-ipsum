import { CustomElement } from "types/custom-elements";

class WebComponentRegister {
	elements: Set<CustomElement> = new Set();
	add(element: CustomElement) {
		this.elements.add(element);
	}
	register() {
		this.elements.forEach((element) => {
			window.customElements.define(element.tagName.toLowerCase(), element);
		});
	}
}

export { WebComponentRegister };
