import { CustomElement } from "types/custom-elements";
import { useInsertionEffect } from "react";

const useCustomElements = (elements: CustomElement[]) => {
	useInsertionEffect(() => {
		elements.forEach((element) => {
			if (window.customElements.get(element.localName)) return;
			window.customElements.define(element.localName, element);
		});
	}, []);
};

export { useCustomElements };
