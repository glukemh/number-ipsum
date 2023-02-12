export type CustomElementLocalName = `${string}-${string}`;

export interface CustomElementClass {
	template?: string;
	styles?: string;
}

export type CustomElement = CustomElementConstructor & {
	localName: CustomElementLocalName;
};
