"use client";
import "./definition";

type Props = CausticCanvasAttributes & {
	children?: JSX.Element | JSX.Element[];
};

const CausticCanvas = ({ children, ...attributes }: Props) => {
	return <caustic-canvas {...attributes}>{children}</caustic-canvas>;
};

export default CausticCanvas;
