export type CustomElementLocalName = `${string}-${string}`;

export type CustomElement = CustomElementConstructor & {
	localName: CustomElementLocalName;
};
