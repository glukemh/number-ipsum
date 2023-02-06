declare interface CausticCanvasAttributes extends HTMLAttributes {
	checked: boolean;
	name: string;
}

declare namespace JSX {
	interface IntrinsicElements {
		"caustic-canvas": CausticCanvasAttributes;
	}
}
