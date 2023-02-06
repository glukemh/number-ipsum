"use client";
import React, { useEffect, useInsertionEffect, useRef, useState } from "react";
import CausticCanvas from "web-components/caustic-canvas/class";
import FormWrapper from "web-components/form-wrapper/class";
import { useCustomElements } from "hooks/useCustomElement";

const Caustic = () => {
	// const canvasRef = useRef<HTMLCanvasElement>(null);
	// const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
	// useEffect(() => {
	//   if (!ctx) {
	//     setCtx(canvasRef.current?.getContext("2d") ?? null);
	// 	}
	// }, [ctx]);
	useCustomElements([CausticCanvas, FormWrapper]);
	return (
		<>
			<div>{FormWrapper.localName}</div>
			<caustic-canvas checked={true} name="abc" />
			<form-wrapper />
		</>
	);
};

export default Caustic;
