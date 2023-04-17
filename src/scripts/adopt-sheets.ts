const adoptSheets = Array.from(document.styleSheets).filter(
	({ ownerNode }) =>
		ownerNode instanceof HTMLLinkElement &&
		ownerNode.dataset.adopt !== undefined
);

document.adoptedStyleSheets = [
	...document.adoptedStyleSheets,
	...adoptSheets.map(({ cssRules }) =>
		Array.from(cssRules).reduce((sheet, rule) => {
			sheet.insertRule(rule.cssText);
			return sheet;
		}, new CSSStyleSheet())
	),
];

adoptSheets.forEach(({ ownerNode }) => {
	if (ownerNode instanceof HTMLLinkElement) {
		ownerNode.disabled = true;
	}
});

export default adoptSheets;
