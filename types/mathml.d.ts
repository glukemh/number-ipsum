type BaseMathMLAttributes = {
	class?: string;
	dir?: "ltr" | "rtl";
	displaystyle?: boolean;
	id?: string;
	mathbackground?: string;
	mathcolor?: string;
	mathsize?: string;
	mathvariant?: "normal";
	nonce?: string;
	scriptlevel?: number | `+${number}` | `-${number}`;
	style?: string;
	tabindex?: number;
	children?: ReactElement<any, any>;
};

declare namespace JSX {
	interface IntrinsicElements {
		math: BaseMathMLAttributes & {
			display?: "block" | "inline";
		};
		semantics: BaseMathMLAttributes;
		annotation: BaseMathMLAttributes & {
			encoding?: string;
		};
		merror: BaseMathMLAttributes;
		mfrac: BaseMathMLAttributes & {
			linethickness?: string;
		};
		mi: BaseMathMLAttributes;
		mmultiscripts: BaseMathMLAttributes;
		mn: BaseMathMLAttributes;
		mo: BaseMathMLAttributes & {
			fence?: boolean;
			largeop?: boolean;
			lspace?: string;
			maxsize?: string;
			minsize?: string;
			movablelimits?: boolean;
			rspace?: string;
			separator?: boolean;
			stretchy?: boolean;
			symmetric?: boolean;
		};
		mover: BaseMathMLAttributes & {
			accent?: boolean;
		};
		mpadded: BaseMathMLAttributes & {
			depth?: string;
			height?: string;
			lspace?: string;
			voffset?: string;
			width?: string;
		};
		mphantom: BaseMathMLAttributes;
		mprescripts: BaseMathMLAttributes;
		mroot: BaseMathMLAttributes;
		mrow: BaseMathMLAttributes;
		ms: BaseMathMLAttributes;
		semantics: BaseMathMLAttributes & {
			encoding?: string;
		};
		mspace: BaseMathMLAttributes & {
			depth?: string;
			height?: string;
			width?: string;
		};
		msqrt: BaseMathMLAttributes;
		mstyle: BaseMathMLAttributes;
		msub: BaseMathMLAttributes;
		msup: BaseMathMLAttributes;
		msubsup: BaseMathMLAttributes;
		mtable: BaseMathMLAttributes;
		mtd: BaseMathMLAttributes;
		mtext: BaseMathMLAttributes;
		mtr: BaseMathMLAttributes;
		munder: BaseMathMLAttributes & {
			accentunder?: boolean;
		};
		munderover: BaseMathMLAttributes & {
			accent?: boolean;
			accentunder?: boolean;
		};
	}
}
