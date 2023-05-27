type ShadowElement = {
	template: string;
	styles: string;
	new (): HTMLElement & {
		styleSheet: CSSStyleSheet;
		shadow: ShadowRoot;
		adoptStyleSheets: (sheets: CSSStyleSheet[]) => void;
	};
};

export default function shadowElement(
	template?: string,
	styles?: string
): ShadowElement {
	return class ShadowDOMElement extends HTMLElement {
		static template = template || "";
		static styles = styles || "";
		styleSheet: CSSStyleSheet = new CSSStyleSheet();
		shadow: ShadowRoot = this.attachShadow({ mode: "open" });
		constructor() {
			super();
			this.shadow.append(
				document
					.createRange()
					.createContextualFragment(ShadowDOMElement.template)
			);
			this.styleSheet.replaceSync(ShadowDOMElement.styles);
			this.adoptStyleSheets([this.styleSheet]);
		}

		adoptStyleSheets(sheets: CSSStyleSheet[]) {
			this.shadow.adoptedStyleSheets = [
				...this.shadow.adoptedStyleSheets,
				...sheets,
			];
		}
	};
}
