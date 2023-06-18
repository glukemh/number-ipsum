type ShadowElement = {
	template?: string;
	new (): HTMLElement & {
		shadow: ShadowRoot;
	};
};

const range = document.createRange();

export default function shadowElement(template?: string): ShadowElement {
	return class ShadowDOMElement extends HTMLElement {
		static template = template;
		shadow: ShadowRoot = this.attachShadow({ mode: "open" });
		constructor() {
			super();
			if (ShadowDOMElement.template) {
				this.shadow.append(
					range.createContextualFragment(ShadowDOMElement.template)
				);
			}
		}
	};
}
