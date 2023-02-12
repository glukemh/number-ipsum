import { Shift, MapArray, EventHandler } from "../types/template";

export function handlerToString<F extends EventHandler>(
	f: F,
	...args: Shift<Parameters<F>>
) {
	return `this.getRootNode().host.${f.name}(${[
		"event",
		...args.map((arg) =>
			JSON.stringify(arg).replaceAll('"', "&quot;").replaceAll("'", "&apos;")
		),
	].join(", ")});`;
}

export function handler<F extends EventHandler>(f: F) {
	return (...args: Shift<Parameters<F>>) => handlerToString<F>(f, ...args);
}

export const map = (parts: TemplateStringsArray, ...args: [MapArray]) => {
	const [mapArray] = args;
	const [firstPart, ...restParts] = parts;
	return mapArray.reduce((acc, s) => {
		s = typeof s === "function" ? s() : s.toString();
		acc += restParts.reduce((acc, part, i) => {
			acc += `${s}${part}`;
			return acc;
		}, firstPart);
		return acc;
	}, "");
};
