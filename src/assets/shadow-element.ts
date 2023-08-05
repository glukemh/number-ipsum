export default class ShadowDOMElement extends HTMLElement {
	shadow: ShadowRoot;
	constructor() {
		super();

		if (this.shadowRoot) {
			this.shadow = this.shadowRoot;
		} else {
			const template = this.querySelector(
				"template[shadowrootmode]"
			) as HTMLTemplateElement;
			const attributeMode = template.getAttribute("shadowrootmode");
			const mode: ShadowRootMode =
				attributeMode === "open" || attributeMode === "closed"
					? attributeMode
					: "open";
			this.shadow = this.attachShadow({ mode });
			this.shadow.appendChild(template.content);
			template.remove();
		}
	}
}
